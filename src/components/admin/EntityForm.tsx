"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveEntity, saveProfile } from "@/lib/admin/actions";
import type { EntityKey, Field } from "@/lib/admin/entities";
import type { Options } from "@/lib/admin/load";
import { FileInput, ImageInput, ImagesInput, ListInput, TagInput } from "./inputs";

type Props =
  | { mode: "entity"; entity: EntityKey; id: string | null; fields: Field[]; initial: Record<string, unknown>; options: Options }
  | { mode: "profile"; fields: Field[]; initial: Record<string, unknown>; options: Options };

export function EntityForm(props: Props) {
  const { fields, initial, options } = props;
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setStatus(null);
      const res = props.mode === "profile" ? await saveProfile(values) : await saveEntity(props.entity, props.id, values);
      if (!res.ok) {
        setStatus({ kind: "error", text: res.error });
        return;
      }
      setStatus({ kind: "ok", text: "Saved — the site is updated." });
      if (props.mode === "entity" && !props.id && res.id) {
        router.replace(`/admin/${props.entity}/${res.id}`);
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            {f.type !== "checkbox" && (
              <label className="label" htmlFor={f.name}>
                {f.label}
                {f.required && <span className="text-accent"> *</span>}
              </label>
            )}
            <FieldInput field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} options={options[f.name]} />
            {f.help && <p className="mt-1 text-xs text-zinc-500">{f.help}</p>}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-4 border-t border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur md:-mx-10 md:px-10">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending && <Loader2 size={14} className="animate-spin" />} Save
        </button>
        {status && (
          <span className={`text-sm ${status.kind === "ok" ? "text-emerald-400" : "text-red-400"}`} role="status">
            {status.text}
          </span>
        )}
      </div>
    </form>
  );
}

function FieldInput({
  field: f,
  value,
  onChange,
  options,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  options?: { value: string; label: string }[];
}) {
  const str = value == null ? "" : String(value);
  switch (f.type) {
    case "textarea":
      return <textarea id={f.name} className="input min-h-28" rows={4} value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "markdown-short":
      return <textarea id={f.name} className="input min-h-40 font-mono text-[13px]" rows={8} value={str} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input id={f.name} type="number" className="input" min={f.min} max={f.max} value={str} onChange={(e) => onChange(e.target.value)} />;
    case "url":
      return <input id={f.name} type="url" className="input" value={str} placeholder={f.placeholder ?? "https://"} onChange={(e) => onChange(e.target.value)} />;
    case "checkbox":
      return (
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-[var(--color-accent)]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {f.label}
        </label>
      );
    case "select":
    case "relation": {
      const opts = f.type === "select" ? f.options ?? [] : options ?? [];
      return (
        <select id={f.name} className="input" value={str} onChange={(e) => onChange(e.target.value || null)}>
          {(f.type === "relation" && !f.required) || !str ? <option value="">{f.relation?.emptyLabel ?? "— select —"}</option> : null}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    case "tags":
      return <TagInput value={(value as string[]) ?? []} onChange={onChange} placeholder={f.placeholder} />;
    case "image":
      return <ImageInput value={(value as string) ?? null} onChange={onChange} folder={f.folder ?? "uploads"} />;
    case "images":
      return <ImagesInput value={(value as string[]) ?? []} onChange={onChange} folder={f.folder ?? "uploads"} />;
    case "file":
      return <FileInput value={(value as string) ?? null} onChange={onChange} folder={f.folder ?? "files"} accept={f.accept} />;
    case "list":
      return <ListInput value={(value as Record<string, string>[]) ?? []} onChange={onChange} itemFields={f.itemFields ?? []} />;
    default:
      return <input id={f.name} className="input" value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
}
