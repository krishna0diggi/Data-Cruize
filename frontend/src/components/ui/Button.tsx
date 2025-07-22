import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const base =
    'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs sm:w-auto';
  const variants = {
    primary:
      'bg-green-600 text-white hover:bg-green-500 sm:ml-3',
    secondary:
      'bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 mt-3 sm:mt-0',
  };
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
