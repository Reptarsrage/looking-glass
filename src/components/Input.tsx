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
        'w-full py-2 px-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-slate-400 h-9',
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
