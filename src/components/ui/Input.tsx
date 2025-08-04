// Input component

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`focus:outline-none focus:ring-1 focus:ring-[#ffad4f] ${className || ''}`}
      {...props} 
    />
  );
}
