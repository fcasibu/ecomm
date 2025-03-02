import { getRootCategories } from "@/features/categories/services/queries";
import { mapErrorToAppError } from "@ecomm/lib/execute-operation";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const result = await getRootCategories();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: mapErrorToAppError(error) },
      { status: 200 },
    );
  }
};
