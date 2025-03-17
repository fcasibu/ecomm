'use client';

import { useScopedI18n } from '@/locales/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function IndexPage() {
  const tScoped = useScopedI18n('Home');

  return (
    <div>
      <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
      <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
      <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
      <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
    </div>
  );
}
