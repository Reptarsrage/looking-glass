import React from 'react';

import { ReactComponent as SVG } from '../assets/undraw_server_down_s4lk.svg';

import Button from './Button';

function ServerDown() {
  return (
    <div className="flex mt-64 flex-col items-center justify-center gap-8">
      <SVG style={{ fill: 'rgb(37, 99, 235)', width: 'auto', height: 400 }} />
      <h4 className="text-4xl">Unable to connect to server</h4>
      <Button onClick={() => location.reload()}>Try Again</Button>
    </div>
  );
}

export default ServerDown;
