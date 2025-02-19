"use client";

import { Button } from "@ecomm/ui/button";
import { Loader, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { Input } from "@ecomm/ui/input";
import { useTransition } from "react";

export function CategorySearch() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  });
  const [_, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: false,
  });

  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await setPage("1");
        });
      }}
    >
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12 py-2 focus:ring-2 focus:ring-primary"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          onClick={() => {
            startTransition(async () => {
              await setQuery("");
              await setPage("1");
            });
          }}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <Button type="submit" disabled={isPending} className="min-w-[120px]">
        {isPending ? <Loader className="animate-spin" size={16} /> : "Search"}
      </Button>
    </form>
  );
}
