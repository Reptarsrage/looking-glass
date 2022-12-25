import React, { useEffect } from 'react';

import { login } from '../api';
import Spinner from '../components/Spinner';
import useModule from '../hooks/useModule';
import useAuthStore from '../store/authentication';

function LoginImplicit() {
  const module = useModule();
  const moduleId = module.id;

  const setAuth = useAuthStore((state) => state.setAuth);

  const [fetching, setFetching] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle('Login');
  }, []);

  // effect to login
  useEffect(() => {
    async function doLogin() {
      setFetching(true);

      try {
        const value = await login(moduleId);
        setAuth(moduleId, value);
      } catch (error: unknown) {
        setError(error as Error);
      } finally {
        setFetching(false);
      }
    }

    doLogin();
  }, []);

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      <div className="mx-auto my-36 flex h-[300px] w-[350px] flex-col border-2 bg-white text-black shadow-xl">
        <div className="mx-8 mt-7 mb-1 flex flex-row justify-start space-x-2">
          <div className="h-7 w-3 bg-[#0DE6AC]"></div>
          <div className="w-3 text-center font-sans text-xl font-bold">
            <h1>Login</h1>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {fetching && (
            <div className="flex flex-col flex-1 relative overflow-hidden">
              <Spinner />
            </div>
          )}

          {error && (
            <div className="my-2 flex justify-center">
              <div className="text-red-500">{error?.message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginImplicit;
