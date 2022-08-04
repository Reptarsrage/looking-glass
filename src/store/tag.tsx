import { createContext, useReducer } from "react";

import type { PostTags } from "./gallery";

export interface Tag extends PostTags {}

type ModuleID = string;
type State = Record<ModuleID, Tag[]>;

interface Action {
  moduleId: string;
  value: Tag[];
}

interface Context {
  readonly tags: State;
  addTags: React.Dispatch<Action>;
}

const reducer = (state: State, action: Action) => ({
  ...state,
  [action.moduleId]: [...(action.moduleId in state ? state[action.moduleId] : []), ...action.value].filter(
    (x, i, a) => a.findIndex((y) => y.id === x.id) === i
  ),
});

export const TagContext = createContext<Context>({
  tags: {},
  addTags: () => {},
});

export const TagProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [tags, addTags] = useReducer(reducer, {});
  return <TagContext.Provider value={{ tags, addTags }}>{children}</TagContext.Provider>;
};
