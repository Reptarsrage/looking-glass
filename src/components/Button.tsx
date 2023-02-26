import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className, ...passThroughProps },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        'px-4 border rounded transition duration-150 font-semibold cursor-pointer select-none whitespace-nowrap h-9',
        // border
        'border-slate-300 dark:border-slate-500',
        // background
        'bg-slate-50 dark:bg-slate-800 text-black dark:text-slate-200',
        // text
        'text-slate-800 dark:text-slate-100',
        // hover
        'hover:bg-slate-100 hover:shadow dark:hover:bg-slate-700',
        // active
        'active:bg-slate-200 dark:active:bg-slate-600 active:shadow-none active:border-slate-400 dark:active:border-slate-400',
        // disabled
        'disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:shadow-none disabled:border-slate-300 dark:disabled:border-slate-500',
        className
      )}
      {...passThroughProps}
    >
      {children}
    </button>
  );
});

Button.defaultProps = {};

export default Button;
