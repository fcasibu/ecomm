import { CustomerDetail } from '@/features/customers/components/customer-detail';
import { Loader } from 'lucide-react';
import { Suspense } from 'react';

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
        <div className="mx-auto flex h-full max-w-4xl items-center justify-center space-y-8 p-8">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <CustomerDetail param={param} />
    </Suspense>
  );
}
