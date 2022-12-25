import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ChevronIcon } from '../assets/chevron.svg';
import { ReactComponent as HomeIcon } from '../assets/home.svg';
import useNavStack from '../hooks/useNavStack';

import Fab from './Fab';

function NavButtons() {
  const navigate = useNavigate();
  const { hasBack, hasForward } = useNavStack();

  function onHome() {
    navigate('/');
  }

  function onBack() {
    navigate(-1);
  }

  function onForward() {
    navigate(1);
  }

  return (
    <>
      <Fab onClick={onHome} disabled={!hasBack}>
        <HomeIcon className="w-5 h-5" />
      </Fab>

      <Fab onClick={onBack} disabled={!hasBack} className="pr-1">
        <ChevronIcon className="w-5 h-5 rotate-180" />
      </Fab>

      <Fab onClick={onForward} disabled={!hasForward} className="pl-1">
        <span>
          <ChevronIcon className="w-5 h-5" />
        </span>
      </Fab>
    </>
  );
}

export default NavButtons;
