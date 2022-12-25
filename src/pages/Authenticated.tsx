import React from 'react';

import useModule from '../hooks/useModule';
import useAuthStore from '../store/authentication';
import { AuthType } from '../types';

import Gallery from './Gallery';
import LoginBasic from './LoginBasic';
import LoginImplicit from './LoginImplicit';
import LoginOauth from './LoginOauth';

interface AuthenticatedProps {
  isTransitioning: boolean;
  locationKey: string;
  size: DOMRect | undefined;
}

function Authenticated({ size, isTransitioning, locationKey }: AuthenticatedProps) {
  const { authType, id } = useModule();
  const auth = useAuthStore((state) => state.authByModuleId[id]);
  const isLoggedIn = !!auth;

  if (!isLoggedIn && authType === AuthType.Basic) {
    return <LoginBasic />;
  } else if (!isLoggedIn && authType === AuthType.Implicit) {
    return <LoginImplicit />;
  } else if (!isLoggedIn && authType === AuthType.OAuth) {
    return <LoginOauth />;
  }

  return <Gallery isTransitioning={isTransitioning} locationKey={locationKey} size={size} />;
}

export default Authenticated;
