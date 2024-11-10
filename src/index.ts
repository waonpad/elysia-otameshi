import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { autoload } from "elysia-autoload";
import { postSchemas } from "./routes/posts";

export const app = new Elysia()
  .use(logger())
  .use(
    swagger({
      provider: "swagger-ui",
    })
  )
  .use(cors())
  .use(
    // サーバーを起動すると自動的にroutesディレクトリを読み込む
    autoload({
      types: {
        output: "./elysia-routes.ts",
        typeName: "ElysiaRoutes",
      },
    })
  )
  // モデルを登録する場合一番上のインスタンスに登録しないといけない
  .model(postSchemas)
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
  });

app.listen(process.env.PORT as string, () =>
  console.log(`🦊 Server started at ${app.server?.url.origin}`)
);

declare global {
  export type ElysiaApp = typeof app;
}
