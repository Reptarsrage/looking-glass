import React, { useEffect } from 'react';

import { authorize } from '../api';
import useModule from '../hooks/useModule';
import useAuthStore from '../store/authentication';

function LoginOauth() {
  const module = useModule();
  const moduleId = module.id;
  const oAuthUrl = module.oAuthUrl;

  const setAuth = useAuthStore((state) => state.setAuth);

  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle('Login');
  }, []);

  async function doLogin() {
    if (!oAuthUrl) {
      return;
    }

    setFetching(true);

    try {
      const code = await window.electronAPI.oauth(oAuthUrl);
      const value = await authorize(moduleId, code);
      setAuth(moduleId, value);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setFetching(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fetching) {
      doLogin();
    }
  }

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      <form
        className="mx-auto my-36 flex h-[300px] w-[350px] flex-col border-2 bg-white text-black shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mx-8 mt-7 mb-1 flex flex-row justify-start space-x-2">
          <div className="h-7 w-3 bg-[#0DE6AC]"></div>
          <div className="w-3 text-center font-sans text-xl font-bold">
            <h1>Login</h1>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="text-center font-sans text-xl">
            <h2>Authorize using OAuth flow</h2>
          </div>
        </div>
        <div className="my-2 flex justify-center">
          <button disabled={fetching} className="w-72 border bg-[#0DE6AC] p-2 font-sans">
            Authorize
          </button>
        </div>
        {error && (
          <div className="my-2 justify-center">
            <div className="text-center font-sans text-red-500">{error?.message}</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginOauth;
