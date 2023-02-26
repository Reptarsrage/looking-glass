import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Button(
  { children, className, ...passThroughProps },
  ref
) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full py-2 px-4 border rounded-md outline-none h-9',
        'dark:text-white bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900',
        'border-slate-300 dark:border-slate-500 focus:border-slate-400 dark:focus:border-slate-400',
        className
      )}
      {...passThroughProps}
    >
      {children}
    </input>
  );
});

Input.defaultProps = {};

export default Input;
