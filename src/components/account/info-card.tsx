"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/account-actions";
import type { InfoField } from "@/lib/account-data";

// A card with read-only values and an "Edit" button that swaps them for a form.
// Saving runs `action` (a server action calling Laravel); the page re-renders with the stored values.
export function InfoCard({
  title,
  fields,
  action,
  avatar,
  columns = 2,
}: {
  title: string;
  fields: InfoField[];
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  avatar?: string;
  columns?: 1 | 2;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);
  // Editing ends by itself once a save newer than the click on "Edit" comes back.
  const [editStartedAt, setEditStartedAt] = useState<number | null>(null);
  const savedAt = state.status === "saved" ? state.at : 0;
  const editing = editStartedAt !== null && savedAt < editStartedAt;
  const setEditing = (on: boolean) => setEditStartedAt(on ? Date.now() : null);

  const idFor = (f: InfoField) => `${title}-${f.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const errorFor = (f: InfoField) => (state.status === "error" ? state.errors?.[f.name]?.[0] : undefined);
  const valueFor = (f: InfoField) => (state.status === "error" ? state.values?.[f.name] : undefined) ?? f.value ?? "";

  return (
    <section className="flex items-start gap-2.5 rounded-xl border border-ivory p-6">
      <form action={formAction} className="flex flex-1 flex-col gap-4">
        <h2 className="font-heading text-xl">{title}</h2>
        {avatar && (
          <Image src={avatar} alt="" width={72} height={72} className="size-[72px] rounded-full object-cover" />
        )}
        <dl className={`grid gap-6 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
          {fields.map((f) => (
            <div key={f.name} className="flex min-w-0 flex-col gap-1">
              {editing ? (
                <>
                  <Label htmlFor={idFor(f)} className="text-sm">
                    {f.label}
                  </Label>
                  {f.multiline ? (
                    <Textarea id={idFor(f)} name={f.name} rows={3} defaultValue={valueFor(f)} className="bg-white" />
                  ) : (
                    <Input
                      id={idFor(f)}
                      name={f.name}
                      type={f.type ?? "text"}
                      defaultValue={valueFor(f)}
                      aria-invalid={errorFor(f) ? true : undefined}
                      className="h-10 bg-white"
                    />
                  )}
                  {errorFor(f) && <p className="text-sm text-[#b10000]">{errorFor(f)}</p>}
                </>
              ) : (
                <>
                  <dt className="text-sm">{f.label}</dt>
                  <dd className="break-words text-base">{f.value || <span className="text-neutral-400">—</span>}</dd>
                </>
              )}
            </div>
          ))}
        </dl>
        {editing && state.status === "error" && !state.errors && (
          <p role="alert" className="text-sm text-[#b10000]">
            {state.message}
          </p>
        )}
        {!editing && state.status === "saved" && (
          <p role="status" className="text-sm">
            {state.message}
          </p>
        )}
        {editing && (
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#3c2b21] px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-bistre px-6 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-bistre px-6 py-3 text-base transition-colors hover:bg-bistre/10"
        >
          Edit
        </button>
      )}
    </section>
  );
}
