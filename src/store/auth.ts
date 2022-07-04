import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import produce from "immer";

export interface Auth {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expires?: Date;
  scope: string;
  tokenType: string;
}

export interface State {
  authByModule: Record<string, Auth>;
}

export interface Mutations {
  setAuth: (moduleId: string, state: Auth) => void;
}

const name = "auth";
export const useAuthStore = create<State & Mutations>(
  persist(
    devtools(
      (set) => ({
        // State
        authByModule: {},

        // Mutations
        setAuth: (moduleId, auth) =>
          set(
            produce<State>((draft) => {
              draft.authByModule[moduleId] = auth;
            }),
            false,
            `${name}/setAuth`
          ),
      }),
      { name }
    ),
    {
      name,
      getStorage: () => localStorage,
    }
  )
);
