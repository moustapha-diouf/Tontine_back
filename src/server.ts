// src/server.ts
import { Routing, createServer, DependsOnMethod } from "express-zod-api";
import { cfg } from "./config.js";
import { helloWorldEndpoint } from "./features/hello.ts";
import { createAccountEndpoint } from "./features/createAccount.ts";
import { getAccountEndpoint } from "./features/getAccount.ts";
import { requestOtpEndpoint } from "./features/requestOtp.ts";

const routing: Routing = {
  v1: {
    "hello": helloWorldEndpoint,
    "account": new DependsOnMethod({
      get: getAccountEndpoint,
      post: createAccountEndpoint
    }),
    "auth": {
      "post /request-otp": requestOtpEndpoint,
    }
  },
};

createServer(cfg, routing);
