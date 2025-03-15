import { Suspense } from "react";
import { Separator } from "@ecomm/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ecomm/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ecomm/ui/tabs";
import { Skeleton } from "@ecomm/ui/skeleton";
import { StoreCreateForm } from "@/features/store/components/store-create-form";
import { getLocales } from "@ecomm/lib/locales";
import { LocalesTable } from "@/features/store/components/locales-table";
import { Heading } from "@ecomm/ui/typography";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locales = getLocales();

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <Heading as="h1">Locale Settings</Heading>
        </div>
        <Separator />

        <Tabs defaultValue="locales" className="w-full">
          <TabsList>
            <TabsTrigger value="locales">Locales</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
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
            className="flex items-center justify-between p-4 border rounded-md"
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
