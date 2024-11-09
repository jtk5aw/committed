## DB Stuff

After updating the schema files for the db run the following command to generate migrations 

```
npm run db generate
```

Then run this command to actually apply the migrations. Note, that the cloudflare credentials will have to be avavailable at `CLOUDFLARE_API_TOKEN`

```
npm run db migrate
```
