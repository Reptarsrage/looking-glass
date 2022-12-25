import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { needsRefresh, refreshAuth } from '../api';
import type { Auth } from '../types';

type State = {
  authByModuleId: Record<string, Auth>;
  setAuth: (moduleId: string, auth: Auth) => void;
  refresh: (moduleId: string) => Promise<string | undefined>;
};

const useAuthStore = create<State>()(
  persist(
    devtools((set, get) => ({
      authByModuleId: {},
      setAuth: (moduleId: string, auth: Auth) => {
        const { authByModuleId } = get();
        authByModuleId[moduleId] = auth;
        set({ authByModuleId });
      },
      refresh: async (moduleId: string) => {
        const { authByModuleId } = get();
        const auth = authByModuleId[moduleId];

        if (auth && needsRefresh(auth.expires)) {
          const newAuth = await refreshAuth(moduleId, auth.refreshToken);
          authByModuleId[moduleId] = newAuth;

          set({ authByModuleId });

          return newAuth.accessToken;
        }

        return auth?.accessToken;
      },
    })),
    {
      name: 'authentication',
    }
  )
);

export default useAuthStore;
