import clsx from 'clsx';
import React, { memo, useEffect, useRef } from 'react';

import useAddFilter from '../../hooks/useAddFilter';
import useDrawerStore from '../../store/drawer';
import useModalStore from '../../store/modal';
import type { Filter } from '../../types';

export interface FilterProps {
  filter: Filter;
  isFocused?: boolean;
  style?: React.CSSProperties;
  onFocus?: () => void;
}

function FilterElt({ filter, isFocused, onFocus, style }: FilterProps) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);

  const modalIsOpen = useModalStore((state) => state.open);
  const toggleModal = useModalStore((state) => state.toggleModal);

  const addFilter = useAddFilter();

  // Effect to focus on item
  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.focus({ preventScroll: true });
    }
  }, [isFocused]);

  function onClick() {
    const filterToAdd = filter;
    toggleDrawer(false, () => {
      if (modalIsOpen) {
        toggleModal(false, undefined, undefined, () => {
          addFilter(filterToAdd);
        });
      } else {
        addFilter(filterToAdd);
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      onClick();
    }
  }

  return (
    <li className="w-full flex" style={style}>
      <button
        ref={itemRef}
        role="link"
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        onFocus={onFocus}
        className={clsx(
          'text-black focus:bg-slate-200 w-full text-start px-2 outline-none',
          !filter.isPlaceholder && ' hover:bg-slate-100'
        )}
      >
        {filter.isPlaceholder ? (
          <span
            className="animate-pulse bg-slate-700 rounded-full inline-block"
            style={{ height: '1em', width: 200 }}
          />
        ) : (
          <span>{filter.name}</span>
        )}
      </button>
    </li>
  );
}

FilterElt.defaultProps = {
  isFocused: false,
  onFocus: undefined,
  style: undefined,
};

export default memo(
  FilterElt,
  (prev, next) => prev.filter === next.filter && prev.style === next.style && prev.isFocused === next.isFocused
);
