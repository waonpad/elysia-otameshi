import { Elysia, t } from "elysia";

export const postSchema = t.Object({
  id: t.Number(),
  title: t.String({
    minLength: 1,
    examples: ["First post"],
  }),
});

export const postParamsSchema = t.Pick(postSchema, ["id"]);

export const createPostSchema = t.Pick(postSchema, ["title"]);

export const updatePostSchema = t.Pick(postSchema, ["title"]);

export const postListSchema = t.Object(
  {
    items: t.Array(postSchema),
  },
  // NOTICE: モデル参照の場合、additionalPropertiesが勝手にtrueになってしまい余剰プロパティも返されてしまう。スキーマオブジェクトを直接指定するとそうはならない(バグ？)
  // 全部にadditionalProperties: falseを指定するの流石にだるい
  // { additionalProperties: false }
);

export const postSchemas = {
  post: postSchema,
  "post.params": postParamsSchema,
  "post.create": createPostSchema,
  "post.update": updatePostSchema,
  "post.list": postListSchema,
};

export const errorResponseSchema = <Code extends string>({
  code,
}: {
  code: Code;
}) =>
  t.Object(
    {
      code: t.Literal(code, { default: code }),
      message: t.String(),
    },
    {
      $id: `#/components/schemas/error.${code}`,
    },
  );

export const ValidationErrorDetailSchema = t.Union([
  t.Object({
    summary: t.Undefined(),
  }),
  t.Object({
    summary: t.String(),
    type: t.Number(),
    schema: t.Object({}),
    path: t.String(),
    value: t.Any(),
    message: t.String(),
  }),
]);

export const validationErrorResponseSchema = t.Composite(
  [
    errorResponseSchema({ code: "VALIDATION" }),
    t.Object({
      on: t.String(),
      expected: t.Any(),
      found: t.Any(),
      errors: t.Array(ValidationErrorDetailSchema),
    }),
  ],
  {
    $id: "#/components/schemas/error.VALIDATION",
  },
);

// $idがないと参照ができないっぽい
// エラーになる
// Unable to dereference schema with $id 'undefined'
export const errorResponseSchemas = {
  "error.NOT_FOUND": errorResponseSchema({ code: "NOT_FOUND" }),
  "error.VALIDATION": validationErrorResponseSchema,
  "error.INVALID_COOKIE_SIGNATURE": t.Composite(
    [
      errorResponseSchema({
        code: "INVALID_COOKIE_SIGNATURE",
      }),
      t.Object({
        key: t.String(),
      }),
    ],
    {
      $id: "#/components/schemas/error.INVALID_COOKIE_SIGNATURE",
    },
  ),
  "error.PARSE": errorResponseSchema({ code: "PARSE" }),
  "error.INTERNAL_SERVER_ERROR": errorResponseSchema({
    code: "INTERNAL_SERVER_ERROR",
  }),
};

export const schemas = {
  ...postSchemas,
  ...errorResponseSchemas,
};

// https://elysiajs.com/essential/structure.html#model-injection
// https://elysiajs.com/essential/validation.html#reference-model
//
// https://elysiajs.com/essential/plugin.html#plugin-deduplication
// models という名前で判別されるので、何度useしても重複は排除される
//
// レスポンスのバリデーションはされない事に注意
export const modelsPlugin = new Elysia({ name: "models" }).model(schemas).as("plugin");
