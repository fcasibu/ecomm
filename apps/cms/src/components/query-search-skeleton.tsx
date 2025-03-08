import { Button } from "@ecomm/ui/button";
import { X } from "lucide-react";
import { Input } from "@ecomm/ui/input";

export function QuerySearchSkeleton() {
  return (
    <form className="flex gap-2">
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          value=""
          className="pr-12 py-2 focus:ring-2 focus:ring-primary"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <Button type="submit" className="min-w-[120px]">
        Search
      </Button>
    </form>
  );
}
