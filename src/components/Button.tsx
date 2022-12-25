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
        'bg-slate-50 text-black px-4 border border-slate-300 rounded transition duration-150 font-semibold cursor-pointer select-none whitespace-nowrap h-9',
        'hover:bg-slate-100 hover:shadow',
        'active:bg-slate-200 active:shadow-none active:border-slate-400',
        'disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:shadow-none disabled:border-slate-300',
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
