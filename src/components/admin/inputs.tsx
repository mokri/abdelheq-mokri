"use client";
import { FileText, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type { SubField } from "@/lib/admin/entities";
import { uploadToMedia } from "@/lib/admin/upload";

export function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  return (
    <div className="input flex flex-wrap items-center gap-1.5 py-1.5">
      {value.map((t, i) => (
        <span key={t + i} className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-zinc-500 hover:text-zinc-100">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder ?? "Type and press Enter"}
        className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-zinc-500"
      />
    </div>
  );
}

function useUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upload = async (files: FileList | File[]) => {
    setBusy(true);
    setError(null);
    try {
      return await Promise.all([...files].map((f) => uploadToMedia(f, folder)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      return [];
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, upload };
}

export function ImageInput({ value, onChange, folder }: { value: string | null; onChange: (v: string | null) => void; folder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUpload(folder);
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-zinc-600">No image</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" disabled={busy} onClick={() => ref.current?.click()}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
            </button>
            {value && (
              <button type="button" className="btn-ghost" onClick={() => onChange(null)}>
                Remove
              </button>
            )}
          </div>
          <input className="input" placeholder="…or paste an image URL" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const [url] = await upload(e.target.files ?? []);
          if (url) onChange(url);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function ImagesInput({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUpload(folder);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((src, i) => (
          <div key={src + i} className="group relative h-20 w-32 overflow-hidden rounded-md border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 rounded bg-black/70 p-1 text-zinc-200 opacity-0 transition group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="flex h-20 w-32 items-center justify-center rounded-md border border-dashed border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          const urls = await upload(e.target.files ?? []);
          if (urls.length) onChange([...value, ...urls]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function FileInput({
  value,
  onChange,
  folder,
  accept,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  folder: string;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUpload(folder);
  return (
    <div>
      <div className="flex gap-2">
        <input className="input" placeholder="https://… or upload" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
        <button type="button" className="btn-ghost shrink-0" disabled={busy} onClick={() => ref.current?.click()}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
        </button>
      </div>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-accent-2 hover:underline">
          <FileText size={12} /> Open current file
        </a>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const [url] = await upload(e.target.files ?? []);
          if (url) onChange(url);
          e.target.value = "";
        }}
      />
    </div>
  );
}

type ListRow = Record<string, string>;

export function ListInput({ value, onChange, itemFields }: { value: ListRow[]; onChange: (v: ListRow[]) => void; itemFields: SubField[] }) {
  const update = (i: number, name: string, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [name]: v } : row)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${itemFields.length}, minmax(0, 1fr))` }}>
            {itemFields.map((sf) => (
              <input
                key={sf.name}
                className="input"
                placeholder={sf.label}
                aria-label={sf.label}
                value={row[sf.name] ?? ""}
                onChange={(e) => update(i, sf.name, e.target.value)}
              />
            ))}
          </div>
          <div className="flex shrink-0">
            <button type="button" className="rounded p-1.5 text-zinc-500 hover:text-zinc-200" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button type="button" className="rounded p-1.5 text-zinc-500 hover:text-zinc-200" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            <button type="button" className="rounded p-1.5 text-zinc-500 hover:text-red-400" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove row">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn-ghost"
        onClick={() => onChange([...value, Object.fromEntries(itemFields.map((f) => [f.name, ""]))])}
      >
        <Plus size={14} /> Add row
      </button>
    </div>
  );
}
