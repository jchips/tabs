import React from 'react';
import { twMerge } from 'tailwind-merge';

const SmallButton = ({ children, className = '', ...props }) => {
  const baseStyle =
    'text-indigo-700 hover:text-white border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-md text-xs text-center px-3 py-2 m-2 dark:border-indigo-400 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 dark:focus:ring-indigo-900';
  return (
    <button
      type='button'
      className={twMerge(`${baseStyle} ${className}`)}
      {...props}
    >
      {children}
    </button>
  );
};

export default SmallButton;
