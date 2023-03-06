import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { needsRefresh, refreshAuth } from '../api';
import type { Auth } from '../types';

type State = {
  authByModuleId: Record<string, Auth>;
  setAuth: (moduleId: string, auth: Auth) => void;
  refresh: (moduleId: string) => Promise<string | undefined>;
  invalidate: (moduleId: string) => void;
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
      invalidate: (moduleId: string) => {
        const { authByModuleId } = get();
        delete authByModuleId[moduleId];
        set({ authByModuleId });
      },
      refresh: async (moduleId: string) => {
        const { authByModuleId } = get();
        const auth = authByModuleId[moduleId];

        if (auth && needsRefresh(auth.expires)) {
          try {
            const newAuth = await refreshAuth(moduleId, auth.refreshToken);
            authByModuleId[moduleId] = newAuth;
            set({ authByModuleId });
            return newAuth.accessToken;
          } catch (ex) {
            // TODO: returning undefined here causes react-query to retry a few more times
            console.error(`Error refreshing auth token for module ${moduleId}`);
            delete authByModuleId[moduleId];
            set({ authByModuleId });
            return undefined;
          }
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
