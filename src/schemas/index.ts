import { Elysia, t } from "elysia";

export const postSchema = t.Object({
  id: t.Number({
    minimum: 2,
  }),
  title: t.String({
    minLength: 1,
    examples: ["First post"],
  }),
});

export const postParamsSchema = t.Pick(postSchema, ["id"]);

export const createPostSchema = t.Pick(postSchema, ["title"]);

export const updatePostSchema = t.Pick(postSchema, ["title"]);

export const postListSchema = t.Object({
  items: t.Array(postSchema),
});

export const postSchemas = {
  post: postSchema,
  "post.params": postParamsSchema,
  "post.create": createPostSchema,
  "post.update": updatePostSchema,
  "post.list": postListSchema,
};

// TODO: バリデーションエラー時等のスキーマを正しく
// TODO: エンドポイントごとに発生する可能性のあるエラースキーマを登録する
export const errorResponseSchema = t.Object({
  message: t.String(),
});

// https://elysiajs.com/essential/structure.html#model-injection
// https://elysiajs.com/essential/validation.html#reference-model
//
// https://elysiajs.com/essential/plugin.html#plugin-deduplication
// models という名前で判別されるので、何度useしても重複は排除される
export const modelsPlugin = new Elysia({ name: "models" })
  .model({
    ...postSchemas,
    error: errorResponseSchema,
  })
  .as("plugin");
