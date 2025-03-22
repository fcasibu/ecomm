import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assertValue(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}
