import {
  EMPTY,
  Observable,
  expand,
  map,
  mergeMap,
  of,
  take,
  tap,
  timer,
  toArray,
} from "https://esm.sh/rxjs@7.8.1";
import {
  ICelebrityAttributes,
  IGameAttributes,
  IGameLinkAttributes,
  IGcoresEntity,
  IInvolvementAttributes,
  IListResponse,
  ITagAttributes,
  IUserAttributes,
} from "./gcores-types.ts";

export interface IBooomGame {
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

export interface IGcoresIdentity {
  id: string;
  type: string;
}

// FIXME: this is waaaaay too verbose, use a better model when modelled
export interface IGcoresEntitySnapshot {
  self: IGameAttributes & IGcoresIdentity;
  participants: {
    gcores_involvement: IInvolvementAttributes & IGcoresIdentity;
    gcores_celebrity: ICelebrityAttributes & IGcoresIdentity;
    gcores_user: IUserAttributes & IGcoresIdentity;
  }[];
  tags: Array<ITagAttributes & IGcoresIdentity>;
  links: Array<IGameLinkAttributes & IGcoresIdentity>;
}

export const fetchBooomData = (
  limit = 20,
  total = Infinity
): Observable<IBooomGame[]> => {
  return of({
    res: {
      data: [],
      included: [],
      meta: { "record-count": Infinity },
    },
    offset: 0,
    limit: limit,
  }).pipe(
    // fetch engine, delay 100ms
    expand(
      (data: {
        res: IListResponse;
        offset: number;
        limit: number;
      }): Observable<{ res: IListResponse; offset: number; limit: number }> => {
        if (data.offset > data.res.meta["record-count"]) {
          return EMPTY;
        }
        return timer(100).pipe(
          //
          tap(() => {
            console.info(
              new Date(),
              `FetchingDataStart`,
              JSON.stringify({
                offset: data.offset,
                limit: data.limit,
                url:
                  `https://www.gcores.com/gapi/v1/games?` +
                  new URLSearchParams({
                    "page[limit]": `${data.limit}`,
                    "page[offset]": `${data.offset}`,
                    sort: "-content-updated-at",
                    include:
                      "tags,user,game-stores,game-links,involvements.entity.user",
                    "filter[is-original]": "1",
                    "filter[revised]": "1",
                    "meta[tags]": ",",
                    "meta[games]": ",",
                  }),
              })
            );
          }),
          mergeMap(() =>
            fetch(
              `https://www.gcores.com/gapi/v1/games?` +
                new URLSearchParams({
                  "page[limit]": `${data.limit}`,
                  "page[offset]": `${data.offset}`,
                  sort: "-content-updated-at",
                  include:
                    "tags,user,game-stores,game-links,involvements.entity.user",
                  "filter[is-original]": "1",
                  "filter[revised]": "1",
                  "meta[tags]": ",",
                  "meta[games]": ",",
                }),
              {
                headers: {
                  "Content-Type": "application/vnd.api+json",
                },
              }
            ).then((res) => res.json())
          ),
          tap((res) => {
            console.info(
              new Date(),
              `FetchingDataResult`,
              JSON.stringify({
                offset: data.offset,
                limit: data.limit,
                data_length: res.data.length,
              })
            );
          }),
          map((res: IListResponse) => ({
            res,
            offset: data.offset + data.limit,
            limit: data.limit,
          }))
        );
      }
    ),
    take(~~(total / limit) + 1),
    // process data
    mergeMap(({ res }): IBooomGame[] => {
      const refs: Map<string, IGcoresEntity> = new Map();
      const ret: IBooomGame[] = [];
      for (const entity of res.included) {
        refs.set(`${entity.id}-${entity.type}`, entity);
      }
      for (const game of res.data) {
        const participants = game.relationships.involvements.data
          .map((ref) => refs.get(`${ref.id}-${ref.type}`)!)
          .map((gcores_involvement) => ({
            gcores_involvement,
            gcores_celebrity: refs.get(
              `${gcores_involvement.relationships.entity.data.id}-${gcores_involvement.relationships.entity.data.type}`
            )!,
          }))
          .map(({ gcores_involvement, gcores_celebrity }) => {
            const user = refs.get(
              `${gcores_celebrity.relationships.user.data.id}-${gcores_celebrity.relationships.user.data.type}`
            )!;
            return {
              gcores_involvement: {
                ...(gcores_involvement.attributes as IInvolvementAttributes),
                id: gcores_involvement.id,
                type: gcores_involvement.type,
              },
              gcores_celebrity: {
                ...(gcores_celebrity.attributes as ICelebrityAttributes),
                id: gcores_celebrity.id,
                type: gcores_celebrity.type,
              },
              gcores_user: {
                ...(user.attributes as IUserAttributes),
                id: user.id,
                type: user.type,
              },
            };
          });
        const links = game.relationships["game-links"].data.map((ref) => ({
          ...(refs.get(`${ref.id}-${ref.type}`)!
            .attributes as IGameLinkAttributes),
          id: ref.id,
          type: ref.type,
        }));
        const tags = game.relationships.tags.data.map((ref) => ({
          ...(refs.get(`${ref.id}-${ref.type}`)!.attributes as ITagAttributes),
          id: ref.id,
          type: ref.type,
        }));
        const origin: IGcoresEntitySnapshot = {
          self: {
            ...(game.attributes as IGameAttributes),
            id: game.id,
            type: game.type,
          },
          participants,
          tags,
          links,
        };
        const attributes: IGameAttributes = game.attributes as any;
        ret.push({
          id: game.id,
          title: attributes.title,
          description: attributes.description,
          icon: attributes.icon,
          cover: attributes.cover,
          create_at: new Date(attributes["created-at"]),
          updated_at: new Date(attributes["updated-at"]),
          team_size: origin.participants.length,
          origin,
        });
      }
      return ret;
    }),
    toArray()
  );
};
