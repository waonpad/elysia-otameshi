import { NotFoundError, t } from "elysia";

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

// これだけを.modelで登録したElysiaインスんタンスをuseする事もできる
// https://elysiajs.com/essential/validation.html#reference-model
// 登録したモデルのキーでスキーマを登録できるみたいだけどSwagger UIに出てこないな・・・
// 直接スキーマの変数を使わないといけないけど、それだとモデルの参照がされない・・・
export const postSchemas = {
  post: postSchema,
  "post.params": postParamsSchema,
  "post.create": createPostSchema,
  "post.update": updatePostSchema,
  "post.list": t.Object({
    items: t.Array(postSchema),
  }),
};

export const posts: (typeof postSchema.static)[] = [
  { id: 1, title: "First post" },
  { id: 2, title: "Second post" },
];

export default (app: ElysiaApp) =>
  app
    .get(
      "",
      { items: posts },
      {
        response: {
          // 200: t.Object({
          //   // 一部だけを文字列で指定はできない？？？
          //   items: t.Array(postSchema),
          // }),
          200: "post.list",
        },
      }
    )
    .post(
      "",
      ({ body, error }) => {
        // return error(500, {
        //   message: "エラーが発生しました",
        // });

        const post = {
          id: posts.length + 1,
          title: body.title,
        };

        return post;
      },
      {
        body: "post.create",
        response: {
          201: "post",
        },
      }
    );
