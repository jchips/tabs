import React from 'react';

const TableButton = ({ children, ...props }) => {
  return (
    <button
      type='button'
      className='w-full text-indigo-700 hover:text-white border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm p-3 m-2 text-center dark:border-indigo-400 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 dark:focus:ring-indigo-900'
      {...props}
    >
      {children}
    </button>
  );
};

export default TableButton;
