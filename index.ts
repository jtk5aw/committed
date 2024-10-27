import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { Resource } from "sst";
import { notes } from "./db/notes.sql";
import { database } from "./db/drizzle";
import { eq } from "drizzle-orm";

const app = new Hono()
  .put("/", async (c) => {
    const key = crypto.randomUUID();
    await Resource.MyBucket.put(key, c.req.raw.body, {
      httpMetadata: {
        contentType: c.req.header("content-type"),
      },
    });
    return new Response(`Object created with key: ${key}`);
  })
  .get("/:id", async (c) => {
    const id: number = parseInt(c.req.param("id"));
    const first = await Resource.MyBucket.list().then((res) => {
      if (id >= res.objects.length) {
        throw new HTTPException(400, { message: "Not an available id." });
      }
      return res.objects.sort(
        (a, b) => a.uploaded.getTime() - b.uploaded.getTime(),
      )[id];
    });
    const result = await Resource.MyBucket.get(first.key);
    c.header("content-type", result.httpMetadata.contentType);
    return c.body(result.body);
  })
  .put("/notes", async (c) => {
    const db = database(Resource.HonoDatabase);
    const body = await c.req.json();
    if (!body.content) {
      throw new HTTPException(400, {
        message: "Did not provide content field",
      });
    }
    const result = await db.insert(notes).values({
      content: body.content,
    });
    return c.body(JSON.stringify(result));
  })
  .get("/notes/:id", async (c) => {
    const db = database(Resource.HonoDatabase);
    const id = parseInt(c.req.param("id"));
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);

    const value = result.values().next();
    if (value.done) {
      throw new HTTPException(400, { message: "Not an available id." });
    }
    return c.body(JSON.stringify(value.value));
  });
app.use(logger());

export default app;
