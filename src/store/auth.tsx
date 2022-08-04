import { createContext, useEffect, useReducer } from "react";

import * as lookingGlassService from "../services/lookingGlassService";

export interface Auth {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expires?: Date;
  scope: string;
  tokenType: string;
}

type ModuleID = string;
type State = Record<ModuleID, Auth>;
interface Action {
  moduleId: string;
  value: Auth;
}

interface Context {
  readonly auth: State;
  setAuth: React.Dispatch<Action>;
}

const LocalKey = "Auth";
function getInitialState(): Record<ModuleID, Auth> {
  const stored = localStorage.getItem(LocalKey);
  if (stored) {
    return JSON.parse(stored) || {};
  }

  return {};
}

const reducer = (state: State, action: Action) => ({
  ...state,
  [action.moduleId]: {
    ...(action.moduleId in state ? state[action.moduleId] : {}),
    ...action.value,
  },
});

export const AuthContext = createContext<Context>({
  auth: {},
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useReducer(reducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(LocalKey, JSON.stringify(auth));
  }, [auth]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export async function login(moduleId: string, context: Context): Promise<string> {
  const { auth, setAuth } = context;
  const moduleAuth = auth.hasOwnProperty(moduleId) ? auth[moduleId] : ({} as Auth);
  const { accessToken, expires, refreshToken } = moduleAuth;
  if (lookingGlassService.needsRefresh(expires, refreshToken)) {
    const value = await lookingGlassService.refreshAuth(moduleId, refreshToken);
    setAuth({ moduleId, value });
    return value.accessToken;
  }

  return accessToken;
}
