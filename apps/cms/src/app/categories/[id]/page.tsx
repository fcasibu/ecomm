import { CategoryDetail } from "@/features/categories/components/category-detail";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = params.then((p) => p.id);

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-8 space-y-8 flex justify-center items-center h-full">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <CategoryDetail categoryId={id} />
    </Suspense>
  );
}
