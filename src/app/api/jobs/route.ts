import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Job Data:", body);


    return NextResponse.json(
      { message: "Job created successfully", data: body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating job" },
      { status: 500 }
    );
  }
}