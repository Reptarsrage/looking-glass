import React from 'react';

import { ReactComponent as SVG } from '../assets/undraw_lost_re_xqjt.svg';

function NotFound() {
  return (
    <div className="flex mt-64 flex-col items-center justify-center gap-8">
      <SVG style={{ fill: 'rgb(37, 99, 235)', width: 'auto', height: 400 }} />
      <h4 className="text-4xl">I knew we should&apos;ve taken that left turn at Albuquerque!</h4>
    </div>
  );
}

export default NotFound;
