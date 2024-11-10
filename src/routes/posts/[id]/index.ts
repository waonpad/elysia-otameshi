import { t } from "elysia";
import { posts, postSchema } from "..";

export default (app: ElysiaApp) =>
  app
    .get(
      "",
      ({ params }) => {
        const post = posts.find((post) => post.id === params.id);

        if (!post) {
          throw new Error("Post not found");
        }

        return post;
      },
      {
        params: t.Pick(postSchema, ["id"]),
        response: {
          200: postSchema,
        },
      }
    )
    .put(
      "",
      ({ body, params }) => {
        return {
          id: params.id,
          title: body.title,
        };
      },
      {
        params: t.Pick(postSchema, ["id"]),
        body: t.Pick(postSchema, ["title"]),
        response: {
          200: postSchema,
        },
      }
    );
