import * as csv from '@fast-csv/parse';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  features: string[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  attributes: { title: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string;
  tier: number;
  createdAt: Date;
  updatedAt: Date;
}

async function readProducts(): Promise<Product[]> {
  const parsedFile = csv.parseFile(path.join(__dirname, './products.csv'), {
    ignoreEmpty: true,
    headers: true,
  });

  const data = await parsedFile.toArray();

  return data.map((item) => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    description: item.description,
    features: item.features.split(','),
    categoryId: item.categoryId,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

async function readProductVariants(): Promise<ProductVariant[]> {
  const parsedFile = csv.parseFile(
    path.join(__dirname, './product-variants.csv'),
    {
      ignoreEmpty: true,
      headers: true,
    },
  );

  const data = await parsedFile.toArray();

  return data.map((item) => ({
    id: item.id,
    productId: item.productId,
    sku: item.sku,
    price: Number(item.price),
    stock: Number(item.stock),
    images: item.images.split(','),
    attributes: Object.entries(item.attributes).map(([attr, value]) => ({
      title: attr,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: value as any,
    })),
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

async function readCategories(): Promise<Category[]> {
  const parsedFile = csv.parseFile(path.join(__dirname, './categories.csv'), {
    ignoreEmpty: true,
    headers: true,
  });

  const data = await parsedFile.toArray();

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    parentId: item.parentId,
    tier: Number(item.tier),
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

async function main() {
  const [categories, products, productVariants, store] = await Promise.all([
    readCategories(),
    readProducts(),
    readProductVariants(),
    prisma.store.findUnique({ where: { locale: 'en-US' } }),
  ]);

  const storeLocale = store?.locale ?? 'en-US';

  await prisma.$transaction(async (tx) => {
    const insertedCategories = new Map<string, boolean>();
    let remainingCategories = [...categories];

    while (remainingCategories.length > 0) {
      const batch = remainingCategories.filter(
        (category) =>
          !category.parentId || insertedCategories.has(category.parentId),
      );

      if (batch.length === 0) {
        throw new Error('Circular dependency detected in categories');
      }

      await Promise.all(
        batch.map(async (category) => {
          await tx.category.create({
            data: {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              image: category.image,
              tier: category.tier,
              ...(category.parentId
                ? { parent: { connect: { id: category.parentId } } }
                : {}),
              store: { connect: { locale: storeLocale } },
            },
          });
          insertedCategories.set(category.id, true);
        }),
      );

      remainingCategories = remainingCategories.filter(
        (category) => !insertedCategories.has(category.id),
      );
    }

    await Promise.all(
      products.map((product) =>
        tx.product.create({
          data: {
            id: product.id,
            name: product.name,
            description: product.description,
            features: product.features,
            sku: product.sku,
            category: { connect: { id: product.categoryId } },
            store: { connect: { locale: storeLocale } },
          },
        }),
      ),
    );

    await Promise.all(
      productVariants.map((variant) =>
        tx.productVariant.create({
          data: {
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            images: variant.images,
            attributes: variant.attributes,
            product: { connect: { id: variant.productId } },
          },
        }),
      ),
    );
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
