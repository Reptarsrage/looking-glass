import React from 'react';

import { ReactComponent as SVG } from '../assets/undraw_graduation_re_gthn.svg';

function EndIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SVG style={{ fill: 'rgb(37, 99, 235)', width: 'auto', height: 200 }} />
      <h4 className="text-xl">Congratulations on reaching the end!</h4>
    </div>
  );
}

export default EndIndicator;
