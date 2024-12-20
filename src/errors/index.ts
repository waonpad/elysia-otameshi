import { Elysia, type ValidationError } from "elysia";
import type { errorResponseSchemas } from "../schemas";

// https://elysiajs.com/essential/life-cycle.html#on-error
export const errorHandlePlugin = new Elysia({ name: "errorHandle" })
  .onError(({ code, error, set }) => {
    console.error(error);

    if (code === "NOT_FOUND") {
      set.status = "Not Found";
      return {
        code,
        message: error.message,
      } satisfies (typeof errorResponseSchemas)["error.NOT_FOUND"]["static"];
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
          | "property" // NOTICE: パスパラメータのバリデーションエラーがparamsではなくpropertyになる(バグ？そもそもpropertyとは)
          | "params"
          | "body"
          | "query"
          | "headers"
          | "cookie"
          | "response" // レスポンスの形式が不正だった場合
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
      } satisfies (typeof errorResponseSchemas)["error.VALIDATION"]["static"];
    }

    if (code === "INVALID_COOKIE_SIGNATURE") {
      set.status = "Bad Request";
      return {
        key: error.key,
        code,
        message: error.message,
      } satisfies (typeof errorResponseSchemas)["error.INVALID_COOKIE_SIGNATURE"]["static"];
    }

    if (code === "PARSE") {
      set.status = "Bad Request";
      return {
        code,
        message: error.message,
      } satisfies (typeof errorResponseSchemas)["error.PARSE"]["static"];
    }

    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = "Internal Server Error";
      return {
        code,
        message: error.message,
      } satisfies (typeof errorResponseSchemas)["error.INTERNAL_SERVER_ERROR"]["static"];
    }

    // Elysiaの組み込みエラー以外で投げられたエラー
    set.status = "Internal Server Error";
    return {
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    } satisfies (typeof errorResponseSchemas)["error.INTERNAL_SERVER_ERROR"]["static"];
  })
  // https://elysiajs.com/essential/plugin.html#_3-instance-as
  .as("plugin");
