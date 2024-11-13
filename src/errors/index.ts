import { Elysia, type ValidationError } from "elysia";

// https://elysiajs.com/essential/life-cycle.html#on-error
export const errorHandlePlugin = new Elysia({ name: "errorHandle" })
  .onError(({ code, error, set }) => {
    console.error(error);

    if (code === "NOT_FOUND") {
      set.status = "Not Found";
      return {
        code,
        message: error.message,
      };
    }

    if (code === "VALIDATION") {
      set.status = "Bad Request";

      const parsedError: {
        // https://github.com/elysiajs/elysia/blob/93d457b9277f07f1f155ef867af97128130286dc/src/error.ts#L173
        type: string;
        // まだ他にどのパターンがあるか調査していない
        on: // ある程度Elysiaのコード見て型を出した
        // https://github.com/elysiajs/elysia/blob/main/src/compose.ts
        // https://github.com/elysiajs/elysia/blob/main/src/type-system.ts
        | "property" // パスパラメータのバリデーションエラーがparamsではなくpropertyになる(バグ？そもそもpropertyとは)
          | "params"
          | "body"
          | "query"
          | "headers"
          | "cookie"
          | "message" // WebSocket？ https://github.com/elysiajs/elysia/blob/e715e006edd603c1b65b7a77401034201c89579a/src/ws/index.ts#L74
          | "env" // これはサーバー起動中にはならなさそう？ https://github.com/elysiajs/elysia/blob/93d457b9277f07f1f155ef867af97128130286dc/src/index.ts#L347
          | "header" // headersとは違う？？？ https://github.com/elysiajs/elysia/blob/e715e006edd603c1b65b7a77401034201c89579a/src/dynamic-handle.ts#L241
          | (string & {});
        summary: string;
        property: string;
        message: string;
        expected: unknown;
        found: unknown;
        errors: ValidationError["all"];
      } = JSON.parse(error.message);

      return {
        code,
        message: "Validation error",
        on: parsedError.on,
        expected: parsedError.expected,
        found: parsedError.found,
        errors: parsedError.errors,
      };
    }

    if (code === "INVALID_COOKIE_SIGNATURE") {
      set.status = "Bad Request";
      return {
        key: error.key,
        code,
        message: error.message,
      };
    }

    if (code === "PARSE") {
      set.status = "Bad Request";
      return {
        code,
        message: error.message,
      };
    }

    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = "Internal Server Error";
      return {
        code,
        message: error.message,
      };
    }

    // Elysiaの組み込みエラー以外で投げられたエラー
    set.status = "Internal Server Error";
    return {
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    };
  })
  // https://elysiajs.com/essential/plugin.html#_3-instance-as
  .as("plugin");
