"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, type FormState } from "@/lib/account-actions";

// Accounts created with Google sign-in have no password yet, so the old one is not asked for.
export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState(changePassword, { status: "idle" } as FormState);
  const [mismatch, setMismatch] = useState(false);

  const fields = [
    ...(hasPassword ? [{ name: "old_password", label: "Old Password", auto: "current-password" }] : []),
    { name: "new_password", label: "New Password", auto: "new-password" },
    { name: "new_password_confirmation", label: "New Password Confirmation", auto: "new-password" },
  ];

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const data = new FormData(e.currentTarget);
        const differs = data.get("new_password") !== data.get("new_password_confirmation");
        setMismatch(differs);
        if (differs) e.preventDefault();
      }}
      className="flex flex-col gap-4 md:w-[65%]"
    >
      {fields.map((f) => {
        const error = state.status === "error" ? state.errors?.[f.name]?.[0] : undefined;
        return (
          <div key={f.name} className="flex flex-col gap-2.5">
            <Label htmlFor={f.name} className="font-heading text-lg">
              {f.label}
            </Label>
            <Input
              id={f.name}
              name={f.name}
              type="password"
              required
              minLength={f.name === "old_password" ? undefined : 8}
              autoComplete={f.auto}
              aria-invalid={error ? true : undefined}
              className="h-11 bg-white"
            />
            {error && <p className="text-sm text-[#b10000]">{error}</p>}
          </div>
        );
      })}
      {mismatch && (
        <p role="alert" className="text-sm text-[#b10000]">
          The new password and its confirmation do not match.
        </p>
      )}
      {state.status === "error" && !state.errors && (
        <p role="alert" className="text-sm text-[#b10000]">
          {state.message}
        </p>
      )}
      {state.status === "saved" && !mismatch && (
        <p role="status" className="text-sm">
          {state.message}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#3c2b21] px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
}
