import { treaty } from "@elysiajs/eden";
import type { ElysiaApp } from ".";

// Routes are a global type so you don't need to import it.

const apiClient = treaty<ElysiaApp>(`http://localhost:${process.env.PORT}`);

const { data } = await apiClient.posts.get();

console.log(data);
