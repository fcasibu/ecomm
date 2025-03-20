'use client';

import { redux } from 'zustand/middleware';
import { create } from 'zustand';

export interface ProductState {
  selectedSize: string;
  selectedQuantity: number;
}

export type ProductAction =
  | { type: 'SELECT_SIZE'; payload: string }
  | { type: 'SELECT_QUANTITY'; payload: number };

const initialState: ProductState = {
  selectedSize: '',
  selectedQuantity: 1,
};

// TODO(fcasibu): atb
const reducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SELECT_SIZE':
      return {
        ...state,
        selectedSize: action.payload,
      };

    case 'SELECT_QUANTITY':
      return {
        ...state,
        selectedQuantity: Math.max(action.payload, 1),
      };

    default:
      return state;
  }
};

export const useProductStore = create(redux(reducer, initialState));
