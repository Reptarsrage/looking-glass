import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSpringRef, animated, config, useTransition } from "@react-spring/web";

import NotFound from "./components/Status/NotFound";
import useNavigationStack from "./hooks/useNavigationStack";
import Loading from "./components/Status/Loading";
import { RouteContext } from "./store/route";

// Dynamic routes
const HomePage = lazy(() => import("./routes/HomePage"));
const GalleryPage = lazy(() => import("./routes/GalleryPage"));
const OAuthPage = lazy(() => import("./routes/OAuthPage"));
const BasicAuthPage = lazy(() => import("./routes/BasicAuthPage"));
const ImplicitAuthPage = lazy(() => import("./routes/ImplicitAuthPage"));
const SettingsPage = lazy(() => import("./routes/SettingsPage"));

const Router: React.FC = () => {
  const location = useLocation();
  const { direction } = useNavigationStack();

  const transRef = useSpringRef();
  const transitions = useTransition(location, {
    ref: transRef,
    keys: null,
    from: { position: "absolute", x: 100 },
    enter: { position: "initial", x: 0 },
    leave: { position: "absolute", x: -100 },
    config: { ...config.stiff, clamp: true },
  });

  useEffect(() => {
    transRef.start();
  }, [location]);

  return (
    <div className="Router">
      {transitions(({ x, position }, location) => (
        <animated.div
          className="Route"
          style={{
            position: position as any,
            transform: x.to((y) => `translate3d(${direction * y}vw,0,0)`),
          }}
        >
          <Suspense fallback={<Loading />}>
            <RouteContext.Provider value={location}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/gallery/:moduleId" element={<GalleryPage />} />
                <Route path="/basic-auth/:moduleId" element={<BasicAuthPage />} />
                <Route path="/oauth/:moduleId" element={<OAuthPage />} />
                <Route path="/implicit-auth/:moduleId" element={<ImplicitAuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RouteContext.Provider>
          </Suspense>
        </animated.div>
      ))}
    </div>
  );
};

export default Router;
