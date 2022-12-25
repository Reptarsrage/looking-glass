import React from 'react';

import useDrawerStore from '../store/drawer';

import Button from './Button';

function FiltersMenu() {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);

  function openDrawer() {
    toggleDrawer(true);
  }

  return <Button onClick={openDrawer}>Filters</Button>;
}

export default FiltersMenu;
