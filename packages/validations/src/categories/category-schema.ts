import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;

export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
