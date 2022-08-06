import { createContext } from "react";
import type { Location } from "react-router-dom";

export const RouteContext = createContext<Location>({} as Location);
