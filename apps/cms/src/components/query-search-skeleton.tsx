import { Button } from '@ecomm/ui/button';
import { X } from 'lucide-react';
import { Input } from '@ecomm/ui/input';

export function QuerySearchSkeleton() {
  return (
    <form className="flex gap-2">
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          value=""
          className="focus:ring-primary py-2 pr-12 focus:ring-2"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        >
          <X className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
      <Button type="submit" className="min-w-[120px]">
        Search
      </Button>
    </form>
  );
}
