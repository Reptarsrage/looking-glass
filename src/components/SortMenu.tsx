import { animated, config, useSpring, useSpringRef, useTransition } from '@react-spring/web';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as ChevronIcon } from '../assets/chevron.svg';
import { ReactComponent as SortDownIcon } from '../assets/sort-down.svg';
import useAppParams from '../hooks/useAppParams';
import useModule from '../hooks/useModule';

import Button from './Button';

interface DropdownItemProps {
  to: string | null;
  hasLink: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onNavigate: (to: string | null) => void;
  onClose: () => void;
}

function DropdownItem({ to, hasLink, children, leftIcon, rightIcon, onNavigate, onClose }: DropdownItemProps) {
  const [, setAppParams] = useAppParams();

  function onClick() {
    if (hasLink) {
      onNavigate(to);
    } else {
      onClose();

      if (to) {
        setAppParams({
          // Keep all other params, update the sort
          sort: to,
        });
      }
    }
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-start whitespace-nowrap py-2 px-4 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {leftIcon && (
        <span className="mr-4 inline-flex" style={{ height: 24, width: 24 }}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="ml-auto inline-flex" style={{ height: 24, width: 24 }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
}

function SortMenu() {
  const [appParams] = useAppParams();
  const isSearching = !!appParams.query;
  const isGallery = !!appParams.galleryId;

  let { sort: sorts, supportsGallerySort } = useModule();
  if (isSearching) {
    sorts = sorts.filter((i) => i.availableInSearch || i.exclusiveToSearch);
  } else {
    sorts = sorts.filter((i) => !i.exclusiveToSearch);
  }

  const defaultSort = sorts.find((i) => i.isDefault);
  const currentSort = sorts.find((i) => i.id === appParams.sort) || defaultSort;
  const parentSort = sorts.find((i) => i.id === currentSort?.parentId);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const transRef = useSpringRef();
  const transitions = useTransition(activeMenu, {
    ref: transRef,
    keys: null,
    from: { x: 100, opacity: 0 },
    enter: { x: 0, opacity: 1 },
    leave: { x: -100, opacity: 0 },
    config: { ...config.stiff, clamp: true },
  });

  const activeHeight = sorts.filter((i) => (!activeMenu && !i.parentId) || i.parentId === activeMenu).length * 40;
  const [{ height }, api] = useSpring(() => ({
    from: { height: 0 },
    to: { height: activeHeight },
    config: { ...config.default },
  }));

  useEffect(() => {
    transRef.start();
    api.start({ height: activeHeight });
  }, [activeMenu]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropContains = dropdownRef.current && dropdownRef.current.contains(event.target as Node);
      const btnContains = buttonRef.current && buttonRef.current.contains(event.target as Node);

      if (open && !dropContains && !btnContains) {
        setOpen(false);
        setActiveMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const toggleMenu = useCallback(() => {
    setOpen((open) => !open);
    setActiveMenu(null);
  }, []);

  const onNavigate = useCallback((to: string | null) => {
    setActiveMenu(to);
    setDirection(to ? 1 : -1);
  }, []);

  let text = currentSort?.name;
  if (parentSort) {
    text = `${parentSort.name} (${text})`;
  }

  return (
    <span className="relative">
      <Button
        type="button"
        onClick={toggleMenu}
        ref={buttonRef}
        disabled={(isGallery && !supportsGallerySort) || sorts.length < 2}
        className="flex items-center"
      >
        <SortDownIcon className="mr-2" height={18} />
        Sort by {text}
      </Button>

      {open && (
        <animated.div
          className="absolute shadow bg-white dark:bg-slate-900 z-10 rounded flex overflow-hidden"
          style={{ width: 200, height, top: 40, right: 0 }}
          ref={dropdownRef}
        >
          <div className="flex-auto relative">
            {transitions(({ x, opacity }, active) => {
              const items = sorts.filter((i) => (!active && !i.parentId) || i.parentId === active);
              const activeItem = sorts.find((i) => i.id === active);

              return (
                <animated.div
                  className="absolute top-0 left-0 w-full h-full flex flex-auto flex-col justify-start"
                  style={{
                    opacity,
                    transform: x.to((y) => `translate3d(${direction * y}%,0,0)`),
                  }}
                >
                  {activeItem && (
                    <DropdownItem
                      to={null}
                      hasLink
                      leftIcon={<ChevronIcon className="rotate-180" />}
                      onNavigate={onNavigate}
                      onClose={toggleMenu}
                    >
                      {activeItem.name}
                    </DropdownItem>
                  )}
                  {items.map((item) => {
                    const hasChildren = sorts.some((i) => i.parentId === item.id);

                    return (
                      <DropdownItem
                        key={item.id}
                        hasLink={hasChildren}
                        to={item.id}
                        rightIcon={hasChildren && <ChevronIcon />}
                        onNavigate={onNavigate}
                        onClose={toggleMenu}
                      >
                        {item.name}
                      </DropdownItem>
                    );
                  })}
                </animated.div>
              );
            })}
          </div>
        </animated.div>
      )}
    </span>
  );
}

export default SortMenu;
