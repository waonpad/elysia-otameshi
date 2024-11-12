import { treaty } from "@elysiajs/eden";
import { app } from ".";

// Routes are a global type so you don't need to import it.

const apiClient = treaty(app);

const { data } = await apiClient.posts.get();

console.log(data);
