import { OrderDetail } from '@/features/orders/components/order-detail';
import { Loader } from 'lucide-react';
import { Suspense } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = params.then((p) => p.id);

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex h-full max-w-4xl items-center justify-center space-y-8 p-8">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <OrderDetail id={id} />
    </Suspense>
  );
}
