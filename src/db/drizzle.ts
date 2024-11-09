import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./commits.sql";

export type DatabaseType = DrizzleD1Database<typeof schema>;
export const database = (d1database: D1Database): DatabaseType => {
  return drizzle(d1database, { schema });
};
