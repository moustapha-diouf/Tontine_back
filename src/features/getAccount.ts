import { defaultEndpointsFactory} from "express-zod-api";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const PathParams = z.object({ userId: z.string() });

export const getAccountEndpoint = defaultEndpointsFactory
  .build({
    method: "get",
    input: z.object({ userId: z.string() }),
    output: z.object({
      userId: z.string(),
      phone: z.string(),
      fullName: z.string(),
      country: z.string().nullable(),
      wallet: z.object({
        walletId: z.string(),
        currency: z.string(),
        balanceCfaCents: z.number(),
      }).nullable(),
    }),
    handler: async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        include: { wallet: true },
      });
      if (!user) throw new Error("not_found");
      return {
        userId: user.id,
        phone: user.phone,
        fullName: user.fullName,
        country: user.country,
        wallet: user.wallet
          ? {
              walletId: user.wallet.id,
              currency: user.wallet.currency,
              balanceCfaCents: user.wallet.balanceCfaCents,
            }
          : null,
      };
    },
  });
