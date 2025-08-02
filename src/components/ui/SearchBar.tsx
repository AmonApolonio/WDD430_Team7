import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Input } from "./Input";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder || "Search..."}
        className="px-3 h-10 border-2 border-orange-300/50 w-full rounded-lg text-gray-600 "
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            if (value) {
              const params = new URLSearchParams(searchParams.toString());
              params.set("query", value);
              router.push(`/search?${params.toString()}`);
            }
          }
        }}
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400"
      />
    </div>
  );
}
