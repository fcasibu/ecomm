import { CustomerDetail } from "@/features/customers/components/customer-detail";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const param = params.then((p) => ({
    id: p.slug[0] as string,
    tab: p.slug?.[1],
  }));

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-8 space-y-8 flex justify-center items-center h-full">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <CustomerDetail param={param} />
    </Suspense>
  );
}
