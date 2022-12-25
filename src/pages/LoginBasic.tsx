import React, { useEffect } from 'react';

import { login } from '../api';
import useModule from '../hooks/useModule';
import useAuthStore from '../store/authentication';

function LoginBasic() {
  const module = useModule();
  const moduleId = module.id;

  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // effect to set window title
  useEffect(() => {
    window.electronAPI.setTitle('Login');
  }, []);

  async function doLogin() {
    setFetching(true);

    try {
      const value = await login(moduleId, username, password);
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
        <div className="flex flex-col items-center">
          <input
            className="my-2 w-72 border p-2"
            type="text"
            placeholder="Username"
            value={username}
            disabled={fetching}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="my-2 w-72 border p-2"
            type="password"
            placeholder="Password"
            value={password}
            disabled={fetching}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-2 flex justify-center">
          <button
            type="submit"
            disabled={fetching}
            className="w-72 border bg-[#0DE6AC] p-2 font-sans disabled:bg-neutral-500"
          >
            Login
          </button>
        </div>
        {error && (
          <div className="my-2 flex justify-center">
            <div className="text-red-500">{error?.message}</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginBasic;
