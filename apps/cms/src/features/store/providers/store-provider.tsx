'use client';

import type { StoreDTO } from '@ecomm/services/store/store-dto';
import { createContext, useContext } from 'react';

const StoreContext = createContext<StoreDTO | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return ctx;
};

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
