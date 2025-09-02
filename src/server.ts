// src/server.ts (extrait)
// src/server.ts (extrait)
import { Routing } from "express-zod-api";

const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
};

import { createServer } from "express-zod-api";
import { cfg } from "./config.js";
import { helloWorldEndpoint } from "./features/hello.js";

createServer(cfg, routing);