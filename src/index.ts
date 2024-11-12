import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import indexRoutes from "./routes/index";
import postsRoutes from "./routes/posts";
import postRoutes from "./routes/posts/[id]";
import { errorHandlePlugin } from "./errors";

export const app = new Elysia()
  .use(logger())
  .use(
    swagger({
      provider: "swagger-ui",
    })
  )
  .use(cors())
  .use(errorHandlePlugin)
  .use(indexRoutes)
  .use(postsRoutes)
  .use(postRoutes);

// https://elysiajs.com/essential/plugin.html#testing
await app.modules;

app.listen(process.env.PORT as string, () =>
  console.log(`🦊 Server started at ${app.server?.url.origin}`)
);

export type ElysiaApp = typeof app;
