import { Elysia, t } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import indexRoutes from "./routes/index";
import postsRoutes from "./routes/posts";
import postRoutes from "./routes/posts/[id]";

export const app = new Elysia()
  .use(logger())
  .use(
    swagger({
      provider: "swagger-ui",
    })
  )
  .use(cors())
  .onError(({ code, error }) => {
    if (code === "UNKNOWN") {
      return {
        message: "An unknown error occurred",
      };
    }

    console.error(code, error);

    if (code === "VALIDATION") {
      return JSON.parse(error.message);
    }

    return error;
  })
  .use(indexRoutes)
  .use(postsRoutes)
  .use(postRoutes);

// https://elysiajs.com/essential/plugin.html#testing
await app.modules;

app.listen(process.env.PORT as string, () =>
  console.log(`🦊 Server started at ${app.server?.url.origin}`)
);

export type ElysiaApp = typeof app;
