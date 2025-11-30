
import { NextRequest, NextResponse } from "next/server";
import getMyToken from "@/src/utilities/getMyToken"; 

export async function PUT(req: NextRequest) {
  try {
    const token = await getMyToken();
    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/users/changeMyPassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (err: unknown) {
  
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
  }
}
