import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Resend } from "resend";

import { EmailTemplate } from "~/components/email-template";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const resend = new Resend("re_T3T2Nw76_LrnEcTmQxUC3oXfdAJ92WQmM");

export const mailerRouter = createTRPCRouter({
  sendEmail: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const data = await resend.emails.send({
        from: "Testing <info@resend.asnubiv.com>",
        to: ["h.horace0921@gmail.com"],
        subject: "Hello world",
        text: "This is sumn.",
        react: EmailTemplate({
          host: "localhost",
          url: "http://localhost:3000/",
        }),
      });

      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      });
    }
  }),
});
