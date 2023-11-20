// GENERATED CODE, MODIFY WITH CAUTION

export interface IListResponse {
  data: IGcoresEntity[];
  included: IGcoresEntity[];
  meta: IListMeta;
}

export interface IGetResponse {
  data: IGcoresEntity;
  included: IGcoresEntity[];
}

export interface IGcoresEntity {
  id: string;
  type: IEntityType;
  attributes:
    | IGameAttributes
    | IGameLinkAttributes
    | IUserAttributes
    | ITagAttributes
    | IInvolvementAttributes
    | ICelebrityAttributes;
  relationships: IDataRelationships;
}

export interface IGameLinkAttributes {
  "attachment-path": string;
  "external-links": string;
  state: string;
  "created-at": Date;
  "approved-at": Date;
}

export interface ICelebrityAttributes {
  name: string;
  description: string;
  "created-at": Date;
  "updated-at": Date;
  "official-names": string[];
  "other-names": string[];
  "subscriptions-count": number;
  "is-settled": boolean;
  specialization: string;
  resume: string | null;
}

export interface ITagAttributes {
  name: string;
  "tag-type": string;
  "taggings-count": number;
  "subscriptions-count": number;
  "created-at": Date;
  "updated-at": Date;
}

export interface IInvolvementAttributes {
  position: string;
  title: string;
  rank: number;
  description: string | null;
}

export interface IUserAttributes {
  nickname: string;
  thumb: string;
  location: string;
  "is-fresh": boolean;
  intro: null | string;
  sex: number | null;
  "followers-count": number;
  "followees-count": number;
  "created-at": Date;
  "psn-id": null | string;
  "live-id": null | string;
  "nintendo-friendcode": null | string;
  "steam-id": null | string;
  "is-deleted": boolean;
  "has-membership": boolean;
  "is-founder-member": boolean;
  "is-treated": boolean;
  "disable-image-download": boolean;
  "medals-count": number;
  "is-gcores-official": boolean;
  "is-pro": boolean;
  linkages: ILinkage;
  "using-grpg-avatar": boolean;
}

export interface ILinkage {
  id: string;
  type: ILinkageType;
  title: string;
  image: null | string;
  permalink: string;
  "content-count"?: number;
}

export enum ILinkageType {
  ExternalLinks = "external-links",
  Portfolios = "portfolios",
  Talks = "talks",
}

export interface IGameAttributes {
  title: string;
  description: string;
  cover: string;
  icon: string;
  "created-at": Date;
  "updated-at": Date;
  "modified-at": Date;
  "is-booom": boolean | null;
  "official-names": string[];
  "other-names": string[];
  screenshots: string[];
  "subscriptions-count": number;
  "reviews-count": number;
  revised: boolean;
  trailers: ITrailer[] | null;
  "development-status": string;
  "average-play-time": null | string;
  "fulltext-description": null | string;
  "download-link": null | string;
  "booom-group-title": null | string;
  "is-original": boolean;
  "content-updated-at": Date;
  "event-name": string | null;
  target: ITarget | null;
  location: null | string;
  "project-type": IProjectType | null;
  introduction: null | string;
  "top-img": null | string;
  "theme-config": null | string;
  "allow-helpful": boolean;
}

export enum IProjectType {
  TypeGame = "type:game",
  TypeProject = "type:project",
  TypeSoftware = "type:software",
}

export enum ITarget {
  Compete = "compete",
  Demo = "demo",
  Sale = "sale",
}

export interface ITrailer {
  player: string;
  playlist: string;
}

export interface IDataRelationships {
  user: IRef;
  entity: IRef;
  // articles: any;
  // videos: any;
  // radios: any;
  // originals: any;
  tags: IRefList;
  involvements: IRefList;
  // "game-stores": any;
  // topics: any;
  // talks: any;
  // reviews: any;
  // "hot-reviews": any;
  // "showcase-review": any;
  // "hosted-files": any;
  "game-links": IRefList;
}

export interface IRefList {
  data: IDAT[];
}

export interface IDAT {
  type: IEntityType;
  id: string;
}

export enum IEntityType {
  Celebrities = "celebrities",
  GameLinks = "game-links",
  Involvements = "involvements",
  Tags = "tags",
  Users = "users",
}

export interface IRef {
  data: IDAT;
}

export interface IListMeta {
  "record-count": number;
}
