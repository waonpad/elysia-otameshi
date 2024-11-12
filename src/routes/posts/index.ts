import { Elysia } from "elysia";
import { modelsPlugin, type postSchema } from "../../schemas";

export const posts: (typeof postSchema.static)[] = [
  { id: 1, title: "First post" },
  { id: 2, title: "Second post" },
];

export default new Elysia({ prefix: "/posts" })
  .use(modelsPlugin)
  .get(
    "",
    { items: posts },
    {
      response: {
        200: "post.list",
      },
    }
  )
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
      },
    }
  );
