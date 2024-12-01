## Git repo setup

The smithy stuff requires a sub-module of smithy-rs. The following commands need to be run to set this up 

```
git submodule init
git submodule update
```

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

**WARNING**: This will require logging into the right AWS account to access the secret. If when I'm reading this I've forgotten that account, just make another secret

```
aws secretsmanager put-secret-value --secret-id CommittedJwtToken --secret-string $(openssl rand -hex 32)
```

Then set it for SST with this command 

```
npx sst secret set CloudflareJwtSecret $(aws secretsmanager get-secret-value --secret-id CommittedJwtToken | jq ".SecretString" -r)
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
JWT=$(curl https://committed-jackson-apiscript.jacksontkennedy99.workers.dev/login -X POST -H 'content-type: application/json' -d '{"username": "username", "password": "password"}' | jq -r ".jwt") && echo $JWT

2. Make a request with the token
curl https://committed-jackson-apiscript.jacksontkennedy99.workers.dev/anything -X POST -H 'content-type: application/json' -H 'Authorization: Bearer '"$JWT"
```

All remainnig posts require bearer auth to pass. Therefore, the command above with `JWT=` must be successfully run before continuing. Then you can make requests until that token expires. 

Make a post
```
curl https://committed-jackson-apiscript.jacksontkennedy99.workers.dev/message -X POST -H 'content-type: application/json' -H 'Authorization: Bearer '"$JWT" -d '{"message": "this is my message", "parent_id": { "commit_type": "empty"} }'
```
Read a post 
```
curl https://committed-jackson-apiscript.jacksontkennedy99.workers.dev/message/2 -X GET -H 'Authorization: Bearer '"$JWT" 
```
Read all posts for a user (plus make it pretty (the json that is))
```
curl "https://committed-jackson-apiscript.jacksontkennedy99.workers.dev/message?user_id=21&pretty" -X GET -H 'Authorization: Bearer '"$JWT"
```
