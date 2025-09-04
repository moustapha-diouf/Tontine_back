// src/server.ts
import { Routing, createServer, DependsOnMethod } from "express-zod-api";
import { cfg } from "./config.js";
import { helloWorldEndpoint } from "./features/hello.ts";
import { createAccountEndpoint } from "./features/createAccount.ts";
import { getAccountEndpoint } from "./features/getAccount.ts";

const routing: Routing = {
  v1: {
    "hello": helloWorldEndpoint,

    // POST /v1/account
    "account": new DependsOnMethod({
      get: getAccountEndpoint,
      post: createAccountEndpoint
    })
  },
};

createServer(cfg, routing);
