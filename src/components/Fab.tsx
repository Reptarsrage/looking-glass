import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const Fab = forwardRef<HTMLButtonElement, FabProps>(function Button({ children, className, ...passThroughProps }, ref) {
  return (
    <button
      ref={ref}
      className={clsx(
        'border inline-flex items-center justify-center rounded-full transition duration-150 cursor-pointer select-none',
        // border
        'border-slate-300 dark:border-slate-500',
        // background
        'bg-slate-50 dark:bg-slate-800 text-black dark:text-slate-200',
        // text
        'text-slate-800 dark:text-white',
        // hover
        'hover:bg-slate-100 hover:shadow dark:hover:bg-slate-700',
        // active
        'active:bg-slate-200 dark:active:bg-slate-600 active:shadow-none active:border-slate-400 dark:active:border-slate-400 active:scale-95',
        // disabled
        'disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:shadow-none disabled:border-slate-300 dark:disabled:border-slate-500 disabled:active:scale-100',
        className
      )}
      {...passThroughProps}
    >
      {children}
    </button>
  );
});

Fab.defaultProps = {};

export default Fab;
