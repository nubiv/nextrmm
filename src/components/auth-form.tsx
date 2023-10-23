"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AuthFormType } from "~/types/index.d";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { redirect } from "next/navigation";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  authFormType: AuthFormType;
}

type RegisterInput = RouterInputs["credentialsRouter"]["register"];

export function AuthForm({ className, authFormType, ...props }: AuthFormProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const register = api.credentialsRouter.register.useMutation();

  async function onRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // ** FormData does not read input values here, wired :( **
    // const formData = new FormData(event.currentTarget);
    // console.log("data>>>", Object.fromEntries(formData));

    const registerInput: RegisterInput = {
      email,
      password,
    };
    setEmail("");
    setPassword("");

    register.mutate(registerInput, {
      onSuccess() {
        console.log("success>>>");
        // ** redirect wouldn't work in this onSuccess callback **
        // redirect("login");
      },
    });
  }

  async function onSignIn(event: React.FormEvent<HTMLFormElement>) {}

  React.useEffect(() => {
    if (register.isSuccess) {
      redirect("login");
    }
  }, [register]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={authFormType === AuthFormType.SignIn ? onSignIn : onRegister}
      >
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              disabled={register.isLoading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="*********"
              type="password"
              autoCapitalize="none"
              autoComplete=""
              autoCorrect="off"
              value={password}
              disabled={register.isLoading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={register.isLoading}>
            {register.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {authFormType === AuthFormType.SignIn
              ? "Sign In with Email"
              : "Sign Up"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={register.isLoading}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          {register.isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={register.isLoading}
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          {register.isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          GitHub
        </Button>
      </div>
      <p>{register.error?.data ? register.error.message : null}</p>
    </div>
  );
}
