export interface WikipediaDateParam {
  year: number;
  month: number;
  day: number;
}

export interface FeedResponse {
  tfa: Tfa;
  mostread: Mostread;
  image: FeedResponseImage;
  onthisday: Onthisday[];
}

export interface FeedResponseImage {
  title: string;
  thumbnail: ThumbnailClass;
  image: ThumbnailClass;
  file_page: string;
  artist: Artist;
  credit: Artist;
  license: License;
  description: Description;
  wb_entity_id: string;
  structured: Structured;
}

export interface Artist {
  html: string;
  text: string;
}

export interface Description {
  html: string;
  text: string;
  lang: Lang;
}

export enum Lang {
  En = 'en',
}

export interface ThumbnailClass {
  source: string;
  width: number;
  height: number;
}

export interface License {
  type: string;
  code: string;
  url: string;
}

export interface Structured {
  captions: Captions;
}

export interface Captions {
  en: string;
  xmf: string;
}

export interface Mostread {
  date: string;
  articles: Tfa[];
}

export interface Tfa {
  views?: number;
  rank?: number;
  view_history?: ViewHistory[];
  type: Type;
  title: string;
  displaytitle: string;
  namespace: Namespace;
  wikibase_item: string;
  titles: Titles;
  pageid: number;
  thumbnail?: ThumbnailClass;
  originalimage?: ThumbnailClass;
  lang: Lang;
  dir: Dir;
  revision: string;
  tid: string;
  timestamp: string;
  description?: string;
  description_source?: DescriptionSource;
  content_urls: ContentUrls;
  extract: string;
  extract_html: string;
  normalizedtitle: string;
  coordinates?: Coordinates;
}

export interface ContentUrls {
  desktop: Desktop;
  mobile: Desktop;
}

export interface Desktop {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export enum DescriptionSource {
  Local = 'local',
}

export enum Dir {
  LTR = 'ltr',
}

export interface Namespace {
  id: number;
  text: string;
}

export interface Titles {
  canonical: string;
  normalized: string;
  display: string;
}

export enum Type {
  Standard = 'standard',
}

export interface ViewHistory {
  date: string;
  views: number;
}

export interface Onthisday {
  text: string;
  pages: Tfa[];
  year: number;
}
