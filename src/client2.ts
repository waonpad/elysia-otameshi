import { treaty } from "@elysiajs/eden";
import { app } from ".";

// Routes are a global type so you don't need to import it.

// 本来Elysiaのインスタンスを渡して実行すると直接Requestを作成してりクエストを行うが、
// autoloadを使用してルートを読み込んだ場合はそれができない

// @ts-ignore
const apiClient = treaty<ElysiaRoutes>(app);

// nullになる
const { data } = await apiClient[""].get();

console.log(data);
