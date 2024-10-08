import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className, children, ...props }) => {
  const baseStyles = "px-4 py-2 rounded";
  const variantStyles = variant === 'outline' ? "border border-gray-300" : "bg-white text-black";

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};
