import { Elysia, InternalServerError } from "elysia";
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
  // https://elysiajs.com/essential/life-cycle.html#on-error
  // TODO: いい感じにする
  .onError(({ code, error, set }) => {
    console.error(code, error);

    if (code === "NOT_FOUND") {
      set.status = "Not Found";
      return error;
    }

    if (code === "VALIDATION") {
      set.status = "Bad Request";
      // TODO; いい感じにする
      return JSON.parse(error.message);
    }

    if (code === "INVALID_COOKIE_SIGNATURE") {
      set.status = "Bad Request";
      return error;
    }

    if (code === "PARSE") {
      set.status = "Bad Request";
      return error;
    }

    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = "Internal Server Error";
      return error;
    }

    // Elysiaの組み込みエラー以外で投げられたエラー
    set.status = "Internal Server Error";
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
