"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ecomm/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ecomm/ui/form";
import { Input } from "@ecomm/ui/input";
import { categoryCreateSchema } from "@ecomm/validations/categories/category-schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { slugify } from "@ecomm/ui/lib/utils";
import { createCategory } from "@/features/categories/services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { TypographyH1 } from "@ecomm/ui/typography";

export function CategoriesForm() {
  const form = useForm<z.infer<typeof categoryCreateSchema>>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof categoryCreateSchema>) => {
    startTransition(async () => {
      const result = await createCategory(data);

      if (!result.success) {
        toast({
          title: "Category creation",
          description: "There was an issue with creating a Category",
        });
        return;
      }

      toast({
        title: "Category creation",
        description: "Category was successfully created",
      });

      form.reset();
      router.push("/categories");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <TypographyH1>Create a New Category</TypographyH1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("slug", slugify(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/categories")}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
