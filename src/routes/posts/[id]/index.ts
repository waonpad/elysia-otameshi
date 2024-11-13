import { Elysia, t } from "elysia";
import { posts } from "..";
import { modelsPlugin, type schemas } from "../../../schemas";

export default new Elysia({ prefix: "/posts/:id" })
  .use(modelsPlugin)
  .guard({
    params: "post.params",
  })
  .get(
    "",
    ({ params, error }) => {
      const post = posts.find((post) => post.id === params.id);

      if (!post) {
        return error(404, {
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    },
    {
      response: {
        200: "post",
        404: "error.NOT_FOUND",
        500: "error.INTERNAL_SERVER_ERROR",
      },
    }
  )
  .put(
    "",
    ({ body, params, error }) => {
      const post = posts.find((post) => post.id === params.id);

      if (!post) {
        return error(404, {
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return {
        ...post,
        ...body,
      };
    },
    {
      body: "post.update",
      response: {
        200: "post",
        400: t.Union([
          t.Ref(
            "#/components/schemas/error.VALIDATION" satisfies `#/components/schemas/${keyof typeof schemas}`
          ),
          t.Ref(
            "#/components/schemas/error.PARSE" satisfies `#/components/schemas/${keyof typeof schemas}`
          ),
        ]) as unknown as ReturnType<
          typeof t.Union<
            [
              (typeof schemas)["error.VALIDATION"],
              (typeof schemas)["error.PARSE"]
            ]
          >
        >,
        404: "error.NOT_FOUND",
        500: "error.INTERNAL_SERVER_ERROR",
      },
    }
  );
