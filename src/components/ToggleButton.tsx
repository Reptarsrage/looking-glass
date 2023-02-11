import clsx from 'clsx';
import React from 'react';

interface ToggleButtonProps {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

function ToggleButton({ label, onChange, value }: ToggleButtonProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      onChange(!value);
    }
  }

  function handleClick() {
    onChange(!value);
  }

  return (
    <div className="flex" tabIndex={0} role="button" onClick={handleClick} onKeyDown={handleKeyDown}>
      <div className="mr-4">{label}</div>
      <div
        className={clsx(
          'pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out',
          value ? 'bg-indigo-600 ring-black/20' : 'bg-slate-900/10 ring-slate-900/5'
        )}
      >
        <div
          className={clsx(
            'h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out',
            value && 'translate-x-4'
          )}
        ></div>
      </div>
    </div>
  );
}

export default ToggleButton;
