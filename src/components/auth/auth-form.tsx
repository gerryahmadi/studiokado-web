"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register, type FormState } from "@/lib/account-actions";

function Field({
  id,
  name = id,
  label,
  type = "text",
  autoComplete,
  required = true,
  minLength,
  error,
  defaultValue,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 bg-white"
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#b10000]">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldError = (state: FormState, name: string) => (state.status === "error" ? state.errors?.[name]?.[0] : undefined);
const typed = (state: FormState, name: string) => (state.status === "error" ? state.values?.[name] : undefined);

const submitClass =
  "w-full rounded-full bg-[#690000] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90 disabled:opacity-60";

export function LoginForm({ failed = false, next }: { failed?: boolean; next?: string }) {
  const [state, action, pending] = useActionState(login, { status: "idle" } as FormState);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="font-heading text-4xl md:text-5xl">Login</h1>
      <form action={action} className="flex w-full flex-col gap-4 md:w-2/5">
        {next && <input type="hidden" name="next" value={next} />}
        <Field id="email" label="Email" type="email" autoComplete="email" error={fieldError(state, "email")}
            defaultValue={typed(state, "email")} />
        <Field id="password" label="Password" type="password" autoComplete="current-password" />
        {failed && state.status === "idle" && (
          <p role="alert" className="text-center text-sm text-[#b10000]">
            Incorrect email or password. Please try again.
          </p>
        )}
        {state.status === "error" && !state.errors && (
          <p role="alert" className="text-center text-sm text-[#b10000]">
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className={submitClass}>
          {pending ? "Signing In…" : "Sign In"}
        </button>
        <div className="flex items-center justify-center gap-2.5 text-sm font-light">
          <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="hover:underline">
            CREATE ACCOUNT
          </Link>
          <span aria-hidden>|</span>
          <Link href="/login" className="hover:underline">
            FORGOT PASSWORD
          </Link>
        </div>
      </form>
    </div>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(register, { status: "idle" } as FormState);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="font-heading text-4xl md:text-5xl">Register</h1>
      <form action={action} className="flex w-full flex-col gap-4 md:w-2/5">
        {next && <input type="hidden" name="next" value={next} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="firstName"
            name="first_name"
            label="First name"
            autoComplete="given-name"
            error={fieldError(state, "first_name")}
            defaultValue={typed(state, "first_name")}
          />
          <Field
            id="lastName"
            name="last_name"
            label="Last name"
            autoComplete="family-name"
            required={false}
            error={fieldError(state, "last_name")}
            defaultValue={typed(state, "last_name")}
          />
        </div>
        <Field id="email" label="Email" type="email" autoComplete="email" error={fieldError(state, "email")}
            defaultValue={typed(state, "email")} />
        <Field id="phone" label="Phone number" type="tel" autoComplete="tel" error={fieldError(state, "phone")}
            defaultValue={typed(state, "phone")} />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          error={fieldError(state, "password")}
        />
        {state.status === "error" && !state.errors && (
          <p role="alert" className="text-center text-sm text-[#b10000]">
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className={submitClass}>
          {pending ? "Creating Account…" : "Register"}
        </button>
        <p className="text-center text-sm font-light">
          Already have an account?{" "}
          <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
