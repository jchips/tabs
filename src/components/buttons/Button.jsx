import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      type='button'
      className='text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm py-3 px-8 m-4 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:focus:ring-indigo-700 dark:border-indigo-700'
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
