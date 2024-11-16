import { Elysia, t } from "elysia";
import { modelsPlugin, type postSchema, type schemas } from "../../schemas";

export const posts: (typeof postSchema.static)[] = [
  { id: 1, title: "First post" },
  { id: 2, title: "Second post" },
];

export default new Elysia({ prefix: "/posts" })
  .use(modelsPlugin)
  // NOTICE: ハンドラを関数ではなくオブジェクトとして書いてもハンドラ自体は動作はするがレスポンスのバリデーションが効かない(バグ？)
  .get("", () => ({ items: posts }), {
    response: {
      200: "post.list",
      500: "error.INTERNAL_SERVER_ERROR",
    },
  })
  .post(
    "",
    ({ body }) => {
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
        400: t.Union([
          t.Ref(
            "#/components/schemas/error.VALIDATION" satisfies `#/components/schemas/${keyof (typeof modelsPlugin)["models"]}`,
          ),
          t.Ref(
            "#/components/schemas/error.PARSE" satisfies `#/components/schemas/${keyof (typeof modelsPlugin)["models"]}`,
          ),
        ]) as unknown as ReturnType<
          typeof t.Union<[(typeof schemas)["error.VALIDATION"], (typeof schemas)["error.PARSE"]]>
        >,
        500: "error.INTERNAL_SERVER_ERROR",
      },
    },
  );
