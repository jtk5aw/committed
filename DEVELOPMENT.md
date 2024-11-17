## DB Stuff

After updating the schema files for the db run the following command to generate migrations 

```
npm run db generate
```

Then run this command to actually apply the migrations. Note, that the cloudflare credentials will have to be avavailable at `CLOUDFLARE_API_TOKEN`

```
npm run db migrate
```

## Secret Stuff

Regenerate the secret used for JWT token stuff with this command

```
npx sst secret set CloudflareJwtSecret $(openssl rand -hex 32)
```


## Commands for testing
Tests signup
```
curl https://committed-jackson-honoscript.jacksontkennedy99.workers.dev/signup -X POST -H 'content-type: application/json' -d '{"username": "username", "password": "password", "is_public": true}'
```
Tests login
```
curl https://committed-jackson-honoscript.jacksontkennedy99.workers.dev/login -X POST -H 'content-type: application/json' -d '{"username": "username", "password": "password"}'
```
Tests verification (two commands) 
```
1. Login and save the token
JWT=$(curl https://committed-jackson-honoscript.jacksontkennedy99.workers.^Cv/login -X POST -H 'content-type: application/json' -d '{"username": "username", "password": "password"}' |
─│ jq -r ".jwt") && echo $JWT

2. Make a request with the token
curl https://committed-jackson-honoscript.jacksontkennedy99.workers.dev/verify -X POST -H 'content-type: application/json' -d '{"token": "'"'$JWT'"'"}'

```
