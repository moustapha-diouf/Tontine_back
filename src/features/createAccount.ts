import { defaultEndpointsFactory } from "express-zod-api";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

import bcrypt from "bcryptjs";

const CreateAccountInput = z.object({
  phone: z.string().min(6),        // e.g., "221771234567" (store E.164 later)
  fullName: z.string().min(2),
  country: z.string().optional(),  // "SN", "CI", etc.
  pin: z.string().min(4).max(6).optional(),
});

const CreateAccountOutput = z.object({
  userId: z.string(),
  walletId: z.string(),
});

export const createAccountEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: CreateAccountInput,
  output: CreateAccountOutput,
  handler: async ({ input }) => {
    // 1) Check uniqueness
    const exists = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (exists) {
      throw new Error("phone_already_registered");
    }

    // 2) Hash PIN if provided
    const pinHash = input.pin ? await bcrypt.hash(input.pin, 10) : null;

    // 3) Create user + wallet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: input.phone,
          country: input.country,
          fullName: input.fullName,
          pinHash,
        },
      });
      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          currency: "XOF",
          balanceCfaCents: 0,
        },
      });
      return { userId: user.id, walletId: wallet.id };
    });

    return result;
  },
});
