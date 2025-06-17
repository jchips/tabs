import React from 'react';

const TableButton = ({ children, ...props }) => {
  return (
    <button
      type='button'
      className='w-full text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm p-3 m-2 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:focus:ring-indigo-700 dark:border-indigo-700'
      {...props}
    >
      {children}
    </button>
  );
};

export default TableButton;
