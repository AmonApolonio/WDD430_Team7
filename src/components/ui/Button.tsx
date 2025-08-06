import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "link" | "outline-filled" | "filled";
  grow?: boolean;
  disabled?: boolean;
}

// Button component
export function Button({ children, variant, className, grow, disabled, ...props }: ButtonProps) {
  const baseClass = "cursor-pointer";

  const growClass = !disabled && grow ? "hover:scale-105 transition-transform" : "";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const variantClass =
    variant === "outline"
      ? "border border-orange-300 bg-transparent rounded-lg text-gray-600 hover:bg-orange-50"
      : variant === "link"
      ? "text-orange-400 rounded-lg hover:underline"
      : variant === "filled"
      ? "border border-orange-300 bg-orange-400/70 text-white rounded-lg hover:bg-orange-400/90"
      : variant === "outline-filled"
      ? "w-full py-2 rounded-lg border border-orange-300/50 bg-orange-50 text-orange-400 text-sm font-bold hover:bg-orange-100"
      : "";

  return (
    <button
      className={`${baseClass} ${variantClass} ${growClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
