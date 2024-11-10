import { treaty } from "@elysiajs/eden";

// Routes are a global type so you don't need to import it.

const apiClient = treaty<ElysiaRoutes>(`http://localhost:${process.env.PORT}`);

const { data } = await apiClient[""].get();

console.log(data);
