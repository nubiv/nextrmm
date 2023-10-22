import Link from "next/link";

import { AuthForm } from "~/components/auth-form";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function SignInPage() {
  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Back
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to sign in
              </p>
            </div>
            <AuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/register"
                className="hover:text-brand underline underline-offset-4"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
