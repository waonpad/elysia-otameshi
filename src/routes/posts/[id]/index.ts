import { Elysia } from "elysia";
import { posts } from "..";
import { modelsPlugin } from "../../../schemas";

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
          message: "Post not found",
        });
      }

      return post;
    },
    {
      response: {
        200: "post",
        404: "error",
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
      body: "post.update",
      response: {
        200: "post",
      },
    }
  );
