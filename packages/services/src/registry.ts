import { Container } from "@ecomm/lib/container";
import { ProductsService } from "./products/products-service";
import { prismaClient } from "@ecomm/db";
import { ProductsController } from "./products/products-controller";
import { CategoriesService } from "./categories/categories-service";
import { CategoriesController } from "./categories/categories-controller";
import { CustomersService } from "./customers/customers-service";
import { CustomersController } from "./customers/customers-controller";

Container.register(ProductsService, [prismaClient]);
Container.register(ProductsController, [Container.resolve(ProductsService)]);

export const productsController = Container.resolve(ProductsController);

Container.register(CategoriesService, [prismaClient]);
Container.register(CategoriesController, [
  Container.resolve(CategoriesService),
]);

export const categoriesController = Container.resolve(CategoriesController);

Container.register(CustomersService, [prismaClient]);
Container.register(CustomersController, [Container.resolve(CustomersService)]);

export const customersController = Container.resolve(CustomersController);
