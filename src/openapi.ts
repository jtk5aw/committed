import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

// Schemas
const NotesRequest = z.object({
  id: z.coerce
    .number()
    .int()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: 123,
    }),
});

export const NotesResponse = z.object({
  id: z
    .number()
    .min(1)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: 3,
    }),
  content: z.string().openapi({
    example: "this is a content example",
  }),
});

// Routes
// Note: The response schemas are validated "by hand" and not by the middleware
export const route = createRoute({
  method: "get",
  path: "/notes/{id}",
  request: {
    params: NotesRequest,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: NotesResponse,
        },
      },
      description: "Retrieve the note",
    },
  },
});
