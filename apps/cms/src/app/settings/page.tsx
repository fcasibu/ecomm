import { Suspense } from 'react';
import { Separator } from '@ecomm/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ecomm/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ecomm/ui/tabs';
import { Skeleton } from '@ecomm/ui/skeleton';
import { StoreCreateForm } from '@/features/store/components/store-create-form';
import { getLocales } from '@ecomm/lib/locales';
import { LocalesTable } from '@/features/store/components/locales-table';
import { Heading } from '@ecomm/ui/typography';
import { StoreUpdateForm } from '@/features/store/components/store-update-form';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locales = getLocales();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8 py-10">
      <div className="flex flex-col gap-6">
        <div>
          <Heading as="h1">Locale Settings</Heading>
        </div>
        <Separator />

        <Tabs defaultValue="store" className="w-full">
          <TabsList>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="locales">Locales</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store settings</CardTitle>
              </CardHeader>
              <CardContent>
                <StoreUpdateForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="locales">
            <Card>
              <CardHeader>
                <CardTitle>Available Locales</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LocalesListSkeleton />}>
                  <LocalesTable searchParams={searchParams} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Locale</CardTitle>
                <CardDescription>
                  Add a new locale with its associated currency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreCreateForm locales={locales} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LocalesListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
    </div>
  );
}
