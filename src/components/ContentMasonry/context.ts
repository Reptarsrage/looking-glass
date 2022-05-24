import { createContext } from "react";
import { Post } from "../../store/gallery";

export interface Column {
  id: string;
  items: Post[];
}

export const MasonryContext = createContext<Column[]>([]);
