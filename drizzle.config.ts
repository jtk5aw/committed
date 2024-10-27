import { Resource } from "sst";
import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: ["./db/**/*.sql.ts"],
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: Resource.CloudflareAccountId.value,
    databaseId: Resource.HoneDatabaseId.value,
    token: Resource.CloudflareApiToken.value,
  },
}) satisfies Config;
