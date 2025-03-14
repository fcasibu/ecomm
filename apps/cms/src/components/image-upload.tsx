"use client";

import type React from "react";

import { useId, useTransition } from "react";
import { Button } from "@ecomm/ui/button";
import { Input } from "@ecomm/ui/input";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { uploadImage } from "@/features/image/services/mutations";
import { ImageComponent } from "@ecomm/ui/image";
import { X } from "lucide-react";

interface ImageUploadProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string | string[] | undefined;
  onUpload: (value: string) => void;
  onRemove?: (value: string) => void;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      return reject(new Error("Invalid file provided"));
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as Data URL"));
      }
    };

    reader.onerror = () => reject(new Error("File reading error"));

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export function ImageUpload({
  value,
  onUpload,
  onRemove,
  ...props
}: ImageUploadProps) {
  const [isPending, startTransition] = useTransition();
  const id = useId();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      const file = event.target.files?.[0];
      if (!file) return;

      const dataURL = await readFileAsDataURL(file);

      const result = await uploadImage(
        dataURL,
        file.name.replace(/\.[^/.]+$/, "").toLowerCase(),
      );

      if (!result.success) {
        switch (result.error.code) {
          case "INVALID_IMAGE_FORMAT":
            toast({
              title: "Error",
              description: "Invalid image format. Please try again.",
              variant: "destructive",
            });
            break;
          case "IMAGE_UPLOAD_ERROR":
            toast({
              title: "Error",
              description: "Failed to upload image. Please try again.",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
              variant: "destructive",
            });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      onUpload(result.data);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value &&
          Array.isArray(value) &&
          value.map((image, index) => (
            <div key={`${image}-${index}`} className="relative">
              <ImageComponent
                src={image}
                alt={`Uploaded image ${index}`}
                className="object-cover rounded aspect-square"
                width={100}
                height={100}
                quality={50}
              />
              {onRemove && (
                <Button
                  aria-label="Remove image"
                  className="absolute top-2 right-2 p-0"
                  onClick={() => onRemove(image)}
                  variant="none"
                >
                  <X aria-hidden />
                </Button>
              )}
            </div>
          ))}
        {value && !Array.isArray(value) && (
          <ImageComponent
            src={value}
            alt="Uploaded image"
            className="object-cover rounded aspect-square"
            width={100}
            height={100}
            quality={50}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          {...props}
          id={props.id || id}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isPending}
        />
        <Button
          type="button"
          onClick={() => document.getElementById(props.id || id)?.click()}
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
