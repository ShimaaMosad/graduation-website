export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Received proposal:", body);


    return Response.json(
      { message: "Proposal created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}