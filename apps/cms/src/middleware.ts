import { NextResponse, type NextRequest } from "next/server";
import { STORE_CURRENT_LOCALE_COOKIE_KEY } from "./features/store/constants";

export default async function (request: NextRequest): Promise<NextResponse> {
  if (!request.cookies.has(STORE_CURRENT_LOCALE_COOKIE_KEY)) {
    request.cookies.set(STORE_CURRENT_LOCALE_COOKIE_KEY, "en-US");
  }

  return NextResponse.next();
}
