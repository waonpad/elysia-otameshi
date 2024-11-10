import { posts } from "..";

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
        params: "post.params",
        response: {
          200: "post",
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
        params: "post.params",
        body: "post.update",
        response: {
          200: "post",
        },
      }
    );
