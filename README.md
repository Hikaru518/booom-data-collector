# booom-data-collector

Gcores Booom pages data structure:

to make a request:

```bash
curl 'https://www.gcores.com/gapi/v1/games?page\[limit\]=20&page\[offset\]=0&sort=-content-updated-at&include=tags&filter\[is-original\]=1&filter\[revised\]=1&meta\[tags\]=%2C&meta\[games\]=%2C' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Referer: https://www.gcores.com/games/original' \
  --compressed
```

response type listed in `gcores-types.ts`

result is arranged in such format:

```typescript
interface IBooomGame {
  id: string;
  title: string;
  description: string;
  icon: string;
  cover: string;
  create_at: Date;
  updated_at: Date;
  team_size: number;
  origin: IGcoresEntitySnapshot;
}

interface IGcoresIdentity {
  id: string;
  type: string;
}

// FIXME: this is waaaaay too verbose, use a better model when modelled
interface IGcoresEntitySnapshot {
  self: IGameAttributes & IGcoresIdentity;
  participants: {
    gcores_involvement: IInvolvementAttributes & IGcoresIdentity;
    gcores_celebrity: ICelebrityAttributes & IGcoresIdentity;
    gcores_user: IUserAttributes & IGcoresIdentity;
  }[];
  tags: Array<ITagAttributes & IGcoresIdentity>;
  links: Array<IGameLinkAttributes & IGcoresIdentity>;
}
```

a sample is provided in `sample.json`

to test, run the following command:

```bash
deno run -A supabase/functions/booom-data-collector/test.ts
```
