import { getCategories } from "@/features/categories/services/queries";
import { mapErrorToAppError } from "@ecomm/lib/execute-operation";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page"));
    const query = searchParams.get("query") ?? "";
    const pageSize = Number(searchParams.get("pageSize"));

    const result = await getCategories({
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
