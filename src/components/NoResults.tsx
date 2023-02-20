import React from 'react';

import { ReactComponent as SVG } from '../assets/undraw_void_3ggu.svg';

function NoResults() {
  return (
    <div className="flex mt-64 flex-col items-center justify-center gap-8">
      <SVG style={{ fill: 'rgb(37, 99, 235)', width: 'auto', height: 400 }} />
      <h4 className="text-4xl">Nothing here but an empty void</h4>
    </div>
  );
}

export default NoResults;
