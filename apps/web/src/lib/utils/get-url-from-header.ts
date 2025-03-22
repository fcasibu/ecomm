import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import 'server-only';

export function getURLFromHeaders(headers: ReadonlyHeaders) {
  const host = headers.get('x-forwarded-host');
  const proto = headers.get('x-forwarded-proto');
  const path = headers.get('next-path');

  return `${proto}://${host}${path}`;
}
