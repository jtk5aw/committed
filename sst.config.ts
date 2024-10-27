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
        const bucket = new sst.cloudflare.Bucket("MyBucket");

        const hono = new sst.cloudflare.Worker("Hono", {
            url: true,
            handler: "index.ts",
            link: [bucket],
        });


        return {
            api: hono.url,
        };
    }
});
