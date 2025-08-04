// TextArea component

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={`focus:outline-none focus:ring-1 focus:ring-[#ffad4f] ${className || ''}`}
      {...props} 
    />
  );
}
