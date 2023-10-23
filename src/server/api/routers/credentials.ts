import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hashPassword } from "~/lib/hash";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const credentialsRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "An user with the same email already exists.",
        });
      }

      const hashedPassword = await hashPassword(input.password);
      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
          hashedPassword: hashedPassword,
        },
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again later.",
        });
      }

      return {
        success: true,
        message: "User signed up successfuly",
      };
    }),
});
