// Input component


import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`focus:outline-none focus:ring-1 focus:ring-[#ffad4f] ${className || ''}`}
      {...props}
    />
  )
);
Input.displayName = "Input";
