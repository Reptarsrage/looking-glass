import { createContext, useEffect, useReducer } from "react";

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

const SessionKey = "Tags";
function getInitialState(): State {
  const stored = sessionStorage.getItem(SessionKey);
  if (stored) {
    return JSON.parse(stored) ?? {};
  }

  return {};
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
  const [tags, addTags] = useReducer(reducer, getInitialState());

  useEffect(() => {
    sessionStorage.setItem(SessionKey, JSON.stringify(tags));
  }, [tags]);

  return <TagContext.Provider value={{ tags, addTags }}>{children}</TagContext.Provider>;
};
