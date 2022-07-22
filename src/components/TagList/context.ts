import { createContext } from "react";

import type { Tag } from "../../store/tag";

export interface TagSection {
  id: string;
  name: string;
  description: string;
  supportsMultiple: boolean;
  supportsSearch: boolean;
  loading: boolean;
  error: boolean;
  itemId?: string;
  items: Tag[];
}

export const TagsContext = createContext<Record<string, TagSection>>({});
