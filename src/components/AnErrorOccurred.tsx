import React from 'react';

import { ReactComponent as SVG } from '../assets/undraw_QA_engineers_dg5p.svg';

import Button from './Button';

function AnErrorOccurred() {
  return (
    <div className="flex mt-64 flex-col items-center justify-center gap-8">
      <SVG style={{ fill: 'rgb(37, 99, 235)', width: 'auto', height: 400 }} />
      <h4 className="text-4xl">Whoops... how did that slip past QA?</h4>
      <Button onClick={() => location.reload()}>Try Again</Button>
    </div>
  );
}

export default AnErrorOccurred;
