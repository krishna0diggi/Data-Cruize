import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;        // new prop to indicate loading state
  loadingText?: string;     // optional custom text when loading
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  loadingText,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  // Match padding, border thickness, and rounded corners from provided style
  const base = `
    inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-md 
    text-base font-semibold\\ transition duration-300 ease-in-out
    focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed border
  `;

  const variants = {
    primary: `
      bg-redOrange text-redOrange-foreground
      border-redOrange
      hover:bg-redOrange/90 hover:border-redOrange
      shadow-md shadow-redOrange/30
      focus-visible:ring-redOrange
    `,
    secondary: `
      bg-white text-gray-700
      border border-gray-300
      hover:bg-gray-100
      shadow-sm
      focus-visible:ring-gableGreen
    `,
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <>
          {/* Replace with your actual Spinner component if available */}
          <span className="animate-spin mr-2 border-2 border-transparent border-t-current rounded-full w-4 h-4" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
