import { treaty } from "@elysiajs/eden";
import { app } from ".";

// Routes are a global type so you don't need to import it.

// @ts-ignore
const apiClient = treaty<ElysiaRoutes>(app);

const { data } = await apiClient.posts.get();

console.log(data);
