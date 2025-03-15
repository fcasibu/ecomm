import { BaseTransformer } from "../base-transformer";
import type { AddressDTO, CustomerDTO } from "./customer-dto";
import type { Customer } from "./customers-service";

export class CustomerTransformer extends BaseTransformer {
  public toDTO(customer: Customer | null | undefined): CustomerDTO | null {
    if (!customer) return null;

    return {
      id: customer.id,
      email: customer.email!,
      phone: customer.phone,
      userId: customer.userId,
      birthDate: this.formatDateToISO(customer.birthDate ?? ""),
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      addresses: customer.addresses.map((address) =>
        this.transformAddress(address),
      ),
      createdAt: this.formatDateToISO(customer.createdAt),
      updatedAt: this.formatDateToISO(customer.updatedAt),
    };
  }

  private transformAddress(address: Customer["addresses"][number]): AddressDTO {
    return {
      id: address.id,
      city: address.city,
      type: address.type,
      state: address.state,
      street: address.street,
      country: address.country,
      postalCode: address.postalCode,
      createdAt: this.formatDateToISO(address.createdAt),
      updatedAt: this.formatDateToISO(address.updatedAt),
    };
  }
}
