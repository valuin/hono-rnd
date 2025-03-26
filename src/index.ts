import { Hono } from "hono";
import { createAuth } from "./utils/auth";
import { cors } from "hono/cors";
import { betterAuth } from "better-auth";

type auth = ReturnType<typeof betterAuth>;

export type VarBindings = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

type Variables = {
  auth: auth;
};

// Create Hono app with both Bindings and Variables
const app = new Hono<{
  Bindings: VarBindings;
  Variables: Variables;
}>();

app.use(
  "*",
  cors({
    origin: "*", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  async (c, next) => {
    // Create the auth instance with environment variables
    const auth = createAuth(c.env);
    console.log(`Request received: ${c.req.method} ${c.req.path}`);
    c.set("auth", auth as any);
    await next();
  }
);

app.get("/", (c) => {
  return c.text("Hello Valtrizt!");
});

app.get("/api/hello", (c) => {
  const database = c.env.DATABASE_URL;
  const BETTER_AUTH_URL = c.env.BETTER_AUTH_URL;
  const BETTER_AUTH_SECRET = c.env.BETTER_AUTH_SECRET;
  return c.json({ message: "Hello World!", database: database, BETTER_AUTH_URL: BETTER_AUTH_URL, BETTER_AUTH_SECRET: BETTER_AUTH_SECRET });
});

app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});


app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return c.get("auth").handler(c.req.raw);
});



export default app;
