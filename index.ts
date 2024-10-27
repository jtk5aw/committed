import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Resource } from "sst";

const app = new Hono()
.put("/*", async (c) => {
    const key = crypto.randomUUID();
    await Resource.MyBucket.put(key, c.req.raw.body, {
        httpMetadata: {
            contentType: c.req.header("content-type"),
        },
    });
    return new Response(`Object created with key: ${key}`);
})
.get("/:id", async (c) => {
    const id: number = parseInt(c.req.param('id'));
    const first = await Resource.MyBucket.list().then(
        (res) => {
            if (id >= res.objects.length) {
                throw new HTTPException(400, { message: 'Not an available id.' });
            };
            return res.objects.sort(
                (a, b) => a.uploaded.getTime() - b.uploaded.getTime(),
            )[id];
        },
    );
    const result = await Resource.MyBucket.get(first.key);
    c.header("content-type", result.httpMetadata.contentType);
    return c.body(result.body);
});

export default app;
