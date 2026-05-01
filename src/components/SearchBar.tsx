import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search..." }: SearchBarProps) => {
  // Debounced controlled input — keeps typing snappy on low-end devices
  // by deferring the parent's filter work until the user pauses.
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (local === value) return;
    const id = setTimeout(() => onChange(local), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-10 h-12 text-base bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl"
      />
      {local && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setLocal(""); onChange(""); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-secondary"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
