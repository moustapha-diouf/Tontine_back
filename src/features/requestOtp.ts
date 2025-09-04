import { defaultEndpointsFactory } from "express-zod-api";
import { prisma } from "../lib/prisma.ts";
import { z } from "zod";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export const requestOtpEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: z.object({
    phone: z.string().min(6),
  }),
  output: z.object({
    sent: z.boolean(),
  }),
  handler: async ({ input }) => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    await prisma.otpCode.create({
      data: { phone: input.phone, code, expiresAt },
    });

    // TODO: integrate with SMS provider (SMTP, etc.)
    console.log(`DEBUG OTP for ${input.phone}: ${code}`);

    return { sent: true };
  },
});
