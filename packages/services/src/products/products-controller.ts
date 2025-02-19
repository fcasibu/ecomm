import {
  productCreateSchema,
  type ProductCreateInput,
} from "@ecomm/validations/products/product-schema";
import type { ProductsService } from "./products-service";
import { ValidationError } from "../errors/validation-error";

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  public async create(input: ProductCreateInput) {
    const result = productCreateSchema.safeParse(input);

    if (!result.success) throw new ValidationError(result.error);

    return this.productsService.create(result.data);
  }
}
