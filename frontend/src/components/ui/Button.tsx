import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold transition duration-200 ease-in-out sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#fdf5f5] text-[#7d2626] hover:bg-[#faeaea] shadow-md hover:shadow-lg ring-1 ring-[#7d2626] focus:ring-[#7d2626] sm:ml-3',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 ring-1 ring-gray-300 shadow-sm sm:mt-0 mt-3',
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
