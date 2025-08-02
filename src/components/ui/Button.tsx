import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "link";
}

// Button component
export function Button({ children, variant, className, ...props }: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border-2 border-gray-300 bg-transparent rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
      : variant === "link"
      ? "text-blue-600 rounded-lg hover:underline"
      : "rounded-lg hover:bg-gray-100";

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
