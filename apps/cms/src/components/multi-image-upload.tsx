import { useState } from "react";
import { ImageUpload } from "./image-upload";

export function MultiImageUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (images: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>([]);

  const handleImageRemove = (value: string) => {
    const filteredImages = images.filter((image) => image !== value);

    setImages(filteredImages);
    onChange(filteredImages);
  };

  const handleImageUpload = (value: string) => {
    const uploadedImages = [...images, value];

    setImages(uploadedImages);
    onChange(uploadedImages);
  };

  return (
    <ImageUpload
      onRemove={handleImageRemove}
      value={value}
      onUpload={handleImageUpload}
    />
  );
}
