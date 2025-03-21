'use client';

import { useScopedI18n } from "@/locales/client";
import { Button } from "@ecomm/ui/button";
import { cn } from "@ecomm/ui/lib/utils";
import { Check, Share } from "lucide-react";
import { useTransition } from "react";
import { sleep } from '@ecomm/lib/sleep'

export function ProductShareButton() {
  const [isPending, startTransition] = useTransition();

  const t = useScopedI18n('productDetail.share')

  const copyToClipboard = (text: string) => {
    startTransition(async () => {
      await navigator.clipboard.writeText(text);
      await sleep(1000);
    })
  };

  return (
    <Button
      onClick={() => copyToClipboard(window.location.href)}
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2 relative transition-all"
      disabled={isPending}
    >
      <span
        className={cn(
          "flex items-center gap-2 transition-opacity",
          isPending ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <Share className="h-5 w-5" />
        {t('title')}
      </span>

      <span
        className={cn(
          "absolute flex items-center gap-2 transition-all",
          isPending ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        aria-live="polite"
      >
        <Check className="text-green-500" />
        {t('copied')}
      </span>
    </Button>
  );
}
