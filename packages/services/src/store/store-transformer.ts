import { BaseTransformer } from "../base-transformer";
import type { StoreDTO } from "./store-dto";
import type { Store } from "@ecomm/db";

export class StoreTransformer extends BaseTransformer {
  public toDTO(store: Store | null | undefined): StoreDTO | null {
    if (!store) return null;

    return {
      id: store.id,
      locale: store.locale,
      currency: store.currency,
      createdAt: this.formatDateToISO(store.createdAt),
      updatedAt: this.formatDateToISO(store.updatedAt),
    };
  }
}
