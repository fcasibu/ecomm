"use client";

import type React from "react";

import { useTransition } from "react";
import { Button } from "@ecomm/ui/button";
import { Input } from "@ecomm/ui/input";
import { toast } from "@ecomm/ui/hooks/use-toast";

interface ImageUploadProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange, ...props }: ImageUploadProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        // TODO(fcasibu): DAM
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value && (
          <img
            src={value}
            alt="Uploaded image"
            className="object-cover rounded aspect-square"
            width={100}
            height={100}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          {...props}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isPending}
        />
        <Button
          type="button"
          onClick={() => document.getElementById(props.id!)?.click()}
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
