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
        'bg-slate-50 text-black border inline-flex items-center justify-center rounded-full border-slate-300 transition duration-150 cursor-pointer select-none w-9 h-9',
        'hover:bg-slate-100 hover:shadow',
        'active:bg-slate-200 active:shadow-none active:border-slate-400 active:scale-95',
        'disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:shadow-none disabled:border-slate-300',
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
