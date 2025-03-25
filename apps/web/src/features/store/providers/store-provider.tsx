'use client';

import type { StoreDTO } from '@ecomm/services/store/store-dto';
import { createContext, useContext } from 'react';

const DEFAULT_STORE = {
  currency: '',
  locale: '',
  id: '',
  freeShippingThreshold: -1,
  createdAt: '',
  updatedAt: '',
} as const;

const StoreContext = createContext<StoreDTO>({
  currency: '',
  locale: '',
  id: '',
  freeShippingThreshold: -1,
  createdAt: '',
  updatedAt: '',
});

export const useStore = () => useContext(StoreContext);

export function StoreProvider({
  children,
  store,
}: {
  children: React.ReactNode;
  store: StoreDTO | null;
}) {
  return (
    <StoreContext.Provider value={store ?? DEFAULT_STORE}>
      {children}
    </StoreContext.Provider>
  );
}
