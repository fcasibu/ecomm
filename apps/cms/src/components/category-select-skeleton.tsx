import { Button } from "@ecomm/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@ecomm/ui/skeleton";
import { Popover, PopoverTrigger } from "@ecomm/ui/popover";

export function CategorySelectSkeleton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className="w-full justify-between"
        >
          <Skeleton className="h-5 w-32" />
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
