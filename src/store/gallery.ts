export interface PostUrl {
  width: number;
  height: number;
  url: string;
}

export interface PostTags {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface PostAuthor {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface PostSource {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface Post {
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
}

export interface Gallery {
  items: Post[];
  hasNext: boolean;
  offset: number;
  after?: string;
  startIndexOfLastPage?: number;
  scrollOffset?: number;
}
