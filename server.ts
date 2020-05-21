import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

config({ safe: true, allowEmptyValues: false, export: true });

const port = parseInt(Deno.env.get("PORT") || "5000");

import router from "./routes.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server Started on Port ${port}`);

await app.listen({ port });
