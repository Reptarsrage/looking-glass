import React from 'react';

import { ReactComponent as FilterIcon } from '../assets/filter.svg';
import useDrawerStore from '../store/drawer';

import Button from './Button';

function FiltersMenu() {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);

  function openDrawer() {
    toggleDrawer(true);
  }

  return (
    <Button onClick={openDrawer} className="flex items-center">
      <FilterIcon className="mr-2" height={18} />
      Filters
    </Button>
  );
}

export default FiltersMenu;
