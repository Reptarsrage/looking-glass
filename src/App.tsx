import { animated, config, useSpringRef, useTransition } from '@react-spring/web';
import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import AppBar from './AppBar';
import CurrentFilters from './components/CurrentFilters';
import FiltersMenu from './components/FiltersMenu';
import NavButtons from './components/NavButtons';
import Search from './components/Search';
import SortMenu from './components/SortMenu';
import useNavStack from './hooks/useNavStack';
import useSize from './hooks/useSize';
import Authenticated from './pages/Authenticated';
import Modules from './pages/Modules';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      retry(failureCount) {
        return failureCount < 3;
      },
    },
  },
});

function AnimatedRouter() {
  // Keep track of navigation
  const location = useLocation();
  const { direction } = useNavStack();

  // Spring
  const transRef = useSpringRef();
  const transitions = useTransition(location, {
    ref: transRef,
    keys: null,
    from: { x: 100 },
    enter: { x: 0 },
    leave: { x: -100 },
    expires: 60000,
    config: { ...config.stiff, clamp: true },
  });

  // keep track of size using a container that wont be affected by transitions
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  useEffect(() => {
    transRef.start();
  }, [transRef, location]);

  return (
    <div ref={containerRef} className="flex flex-col flex-1 relative overflow-hidden">
      {transitions(({ x }, item) => (
        <animated.div
          style={{ transform: x.to((y) => `scale(${1.0 - Math.abs(y) * 0.001}) translate3d(${direction * y}vw,0,0)`) }}
          className="flex flex-col absolute top-0 left-0 w-full h-full"
        >
          <Routes location={item}>
            <Route path="/" element={<Modules />} />
            <Route
              path="/module/:moduleId"
              element={<Authenticated size={size} isTransitioning={item.key !== location.key} locationKey={item.key} />}
            />
          </Routes>
        </animated.div>
      ))}
    </div>
  );
}

function AppWithRouting() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex-none">
        <AppBar />
      </header>

      <main className="flex-auto flex flex-col">
        <div className="flex items-center gap-2 p-2">
          <NavButtons />

          <Routes>
            <Route
              path="/module/:moduleId"
              element={
                <>
                  <Search />
                  <CurrentFilters />

                  <span className="ml-auto" />

                  <SortMenu />
                  <FiltersMenu />
                </>
              }
            />
            <Route path="*" element={<React.Fragment />} />
          </Routes>
        </div>

        <AnimatedRouter />
      </main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AppWithRouting />
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
