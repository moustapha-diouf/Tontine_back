// src/config.ts
import { createConfig } from "express-zod-api";


export const PORT = Number(process.env.PORT ?? 8080);

export const cfg = createConfig({
  http: { listen: PORT },
  cors: true,
  logger: { level: "info" },
  startupLogo: false,
});
 

