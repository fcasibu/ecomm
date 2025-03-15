export interface AddressDTO {
  id: string;
  type: 'BILLING' | 'SHIPPING';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDTO {
  id: string;
  userId: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  birthDate: string | null;
  email: string;
  phone: string | null;
  addresses: AddressDTO[];
  createdAt: string;
  updatedAt: string;
}
