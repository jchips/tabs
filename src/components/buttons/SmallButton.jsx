import React from 'react';
import { twMerge } from 'tailwind-merge';

const SmallButton = ({ children, className = '', ...props }) => {
  const baseStyle =
    'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 font-medium focus:outline-none focus:ring-4 font-medium rounded-md text-xs px-3 py-2 m-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700';
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
