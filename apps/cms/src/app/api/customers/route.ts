import { getCustomers } from "@/features/customers/services/queries";
import { STORE_CURRENT_LOCALE_COOKIE_KEY } from "@/features/store/constants";
import { mapErrorToAppError } from "@ecomm/lib/execute-operation";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page"));
    const query = searchParams.get("query") ?? "";
    const pageSize = Number(searchParams.get("pageSize"));
    const locale = req.cookies.get(STORE_CURRENT_LOCALE_COOKIE_KEY)
      ?.value as string;

    const result = await getCustomers(locale, {
      page,
      query,
      pageSize,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: mapErrorToAppError(error) },
      { status: 200 },
    );
  }
};
