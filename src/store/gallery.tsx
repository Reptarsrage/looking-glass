import { createContext, useState } from "react";
import { nanoid } from "nanoid";

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
  isPlaceholder?: boolean;
}

export interface Gallery {
  items: Post[];
  hasNext: boolean;
  offset: number;
  after?: string;
  isPlaceholder?: boolean;
}

function generatePlaceholderItem(): Post {
  function roundNearest100(num: number): number {
    return Math.round(num / 100) * 100;
  }

  function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return {
    id: nanoid(),
    name: "",
    width: roundNearest100(randomIntFromInterval(1000, 2000)),
    height: roundNearest100(randomIntFromInterval(1000, 2000)),
    isVideo: false,
    isGallery: false,
    urls: [],
    filters: [],
    isPlaceholder: true,
  };
}

export function generatePlaceholder(): Gallery {
  return {
    items: [...Array(10)].map(generatePlaceholderItem),
    hasNext: false,
    offset: 0,
    isPlaceholder: true,
  };
}

interface Context {
  readonly posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const GalleryContext = createContext<Context>({ posts: [], setPosts: () => {} });

export const GalleryProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  return <GalleryContext.Provider value={{ posts, setPosts }}>{children}</GalleryContext.Provider>;
};
