import { Container } from "@ecomm/lib/container";
import { ProductsService } from "./products/products-service";
import { prismaClient } from "@ecomm/db";
import { ProductsController } from "./products/products-controller";
import { CategoriesService } from "./categories/categories-service";
import { CategoriesController } from "./categories/categories-controller";
import { CustomersService } from "./customers/customers-service";
import { CustomersController } from "./customers/customers-controller";
import {
  CloudinaryService,
  getCloudinaryConfig,
} from "./dam/cloudinary-service";
import { ImageService } from "./image/image-service";
import { ImageController } from "./image/image-controller";
import { OrdersService } from "./orders/orders-service";
import { OrdersController } from "./orders/orders-controller";
import { CartService } from "./cart/cart-service";
import { CartController } from "./cart/cart-controller";

Container.register(CloudinaryService, [getCloudinaryConfig]);
Container.register(ImageService, [Container.resolve(CloudinaryService)]);
Container.register(ImageController, [Container.resolve(ImageService)]);

export const imageController = Container.resolve(ImageController);

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

Container.register(OrdersService, [prismaClient]);
Container.register(OrdersController, [Container.resolve(OrdersService)]);

export const ordersController = Container.resolve(OrdersController);

Container.register(CartService, [prismaClient]);
Container.register(CartController, [Container.resolve(CartService)]);

export const cartController = Container.resolve(CartController);
