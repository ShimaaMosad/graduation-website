import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();

  const data = JSON.parse(formData.get("data") as string);
  const file = formData.get("file") as File | null;

  let filePath = null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, buffer);

    filePath = `/uploads/${fileName}`;
  }

  const newReview = {
    ...data,
    attachment: filePath,
    id: Date.now().toString(),
  };

  return NextResponse.json({
    success: true,
    review: newReview,
  });
}