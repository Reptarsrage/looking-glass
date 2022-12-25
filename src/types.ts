export type PostUrl = {
  width: number;
  height: number;
  url: string;
};

export type PostTags = {
  id: string;
  filterSectionId: string;
  name: string;
};

export type PostAuthor = {
  id: string;
  filterSectionId: string;
  name: string;
};

export type PostSource = {
  id: string;
  filterSectionId: string;
  name: string;
};

export type Post = {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  isVideo: boolean;
  isGallery: boolean;
  urls: PostUrl[];
  filters: PostTags[];
  poster?: string;
  author?: PostAuthor;
  date?: string;
  source?: PostSource;
  isPlaceholder?: boolean;
};

export type Gallery = {
  items: Post[];
  hasNext: boolean;
  offset: number;
  after?: string;
  isPlaceholder?: boolean;
};

export type Filter = {
  id: string;
  filterSectionId: string;
  name: string;
  isPlaceholder?: boolean;
};

export enum AuthType {
  None = '',
  OAuth = 'oauth',
  Basic = 'login',
  Implicit = 'implicit',
}

export type FilterSection = {
  id: string;
  name: string;
  description: string;
  supportsMultiple: boolean;
  supportsSearch: boolean;
};

export type Sort = {
  id: string;
  parentId?: string;
  name: string;
  isDefault: boolean;
  availableInSearch: boolean;
  exclusiveToSearch: boolean;
};

export type Module = {
  id: string;
  name: string;
  description: string;
  authType: AuthType;
  oAuthUrl?: string;
  icon: string;
  filters: FilterSection[];
  sort: Sort[];
  supportsItemFilters: boolean;
  supportsAuthorFilter: boolean;
  supportsSourceFilter: boolean;
  supportsGalleryFilters?: boolean; // TODO: Implement this in service
  supportsGallerySearch?: boolean; // TODO: Implement this in service
  supportsGallerySort?: boolean; // TODO: Implement this in service
};

export type Auth = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expires?: Date;
  scope: string;
  tokenType: string;
};
