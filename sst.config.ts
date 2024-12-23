/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "committed",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    // Resources
    const db = new sst.cloudflare.D1("HonoDatabase");
    const jwtSecret = new sst.Secret("CloudflareJwtSecret");
    const auth = new sst.cloudflare.Worker("Auth", {
      url: false,
      handler: "src/auth.ts",
      link: [db, jwtSecret],
    });
    const api = new sst.cloudflare.Worker("Api", {
      url: true,
      handler: "src/api.ts",
      link: [auth, db],
    });

    // Leaving for now cause there's stuff in it and deleting it is causing problems
    const bucket = new sst.cloudflare.Bucket("MyBucket");

    // Other Secrets
    const databaseId = db.id.apply(
      (id) => new sst.Secret("HoneDatabaseId", id),
    );
    const cloudflareAccountId = new sst.Secret(
      "CloudflareAccountId",
      sst.cloudflare.DEFAULT_ACCOUNT_ID,
    );
    const cloudflareApiToken = new sst.Secret(
      "CloudflareApiToken",
      process.env.CLOUDFLARE_API_TOKEN,
    );

    // Other
    new sst.x.DevCommand("DrizzleStudio", {
      link: [db, databaseId, cloudflareAccountId, cloudflareApiToken],
      dev: {
        command: "npx drizzle-kit studio",
      },
    });

    return {
      api: api.url,
    };
  },
});
