"use client";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntity, reorderEntity, setPublished } from "@/lib/admin/actions";
import type { EntityKey } from "@/lib/admin/entities";
import type { Options } from "@/lib/admin/load";

type Row = Record<string, unknown> & { id: string; published?: boolean };

export function EntityList({
  entity,
  rows: initialRows,
  titleField,
  subtitleFields,
  relationOptions,
}: {
  entity: EntityKey;
  rows: Record<string, unknown>[];
  titleField: string;
  subtitleFields: string[];
  relationOptions: Options;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows as Row[]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [prevInitial, setPrevInitial] = useState(initialRows);
  if (prevInitial !== initialRows) {
    setPrevInitial(initialRows);
    setRows(initialRows as Row[]);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null);
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
      router.refresh();
    });

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    const next = arrayMove(rows, from, to);
    setRows(next);
    run(() => reorderEntity(entity, next.map((r) => r.id)));
  }

  const display = (field: string, value: unknown) => {
    const opts = relationOptions[field];
    if (opts) return opts.find((o) => o.value === value)?.label ?? "";
    if (field === "percent") return `${value}%`;
    return value == null ? "" : String(value);
  };

  return (
    <div className="mt-6">
      {error && <p className="mb-3 rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>}
      <div className={`card divide-y divide-zinc-800/80 ${pending ? "opacity-70" : ""}`}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            {rows.map((row) => (
              <SortableRow key={row.id} id={row.id}>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/${entity}/${row.id}`} className="block truncate font-medium hover:text-accent">
                    {String(row[titleField] ?? "Untitled")}
                  </Link>
                  <div className="truncate text-xs text-zinc-500">
                    {subtitleFields.map((f) => display(f, row[f])).filter(Boolean).join(" · ")}
                  </div>
                </div>
                {typeof row.cover_image === "string" && row.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.cover_image} alt="" className="hidden h-9 w-14 rounded object-cover sm:block" />
                )}
                <div className="flex shrink-0 items-center gap-1">
                  <IconButton
                    label={row.published ? "Unpublish" : "Publish"}
                    onClick={() => run(() => setPublished(entity, row.id, !row.published))}
                  >
                    {row.published ? <Eye size={16} /> : <EyeOff size={16} className="text-zinc-600" />}
                  </IconButton>
                  <Link href={`/admin/${entity}/${row.id}`} className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" aria-label="Edit">
                    <Pencil size={16} />
                  </Link>
                  <IconButton
                    label="Delete"
                    onClick={() => {
                      if (confirm(`Delete “${String(row[titleField])}”? This cannot be undone.`)) {
                        setRows((rs) => rs.filter((r) => r.id !== row.id));
                        run(() => deleteEntity(entity, row.id));
                      }
                    }}
                  >
                    <Trash2 size={16} className="hover:text-red-400" />
                  </IconButton>
                </div>
              </SortableRow>
            ))}
          </SortableContext>
        </DndContext>
        {rows.length === 0 && <p className="px-4 py-8 text-center text-sm text-zinc-500">Nothing here yet.</p>}
      </div>
    </div>
  );
}

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 px-3 py-2.5 ${isDragging ? "relative z-10 bg-zinc-800 shadow-lg" : "bg-transparent"}`}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-zinc-600 hover:text-zinc-300 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      {children}
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
      {children}
    </button>
  );
}
