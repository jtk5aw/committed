import { drizzle } from "drizzle-orm/d1";
import * as schema from "./notes.sql";

export const database = (d1database: D1Database) => {
  return drizzle(d1database, { schema });
};
