'use client';

import type { StoreDTO } from '@ecomm/services/store/store-dto';
import { createContext, useContext } from 'react';

const StoreContext = createContext<StoreDTO | null>({
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
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
