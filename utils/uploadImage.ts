import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // 1. Validate file type
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPEG/PNG files are allowed");
  }

  // 2. Convert to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 3. Ensure target directory exists
  const uploadDir = path.join(process.cwd(), "public", "plans");
  await mkdir(uploadDir, { recursive: true });

  // 4. Generate unique filename
  const ext = path.extname(file.name);
  const fileName = `${Date.now()}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  // 5. Write file to disk
  await writeFile(filePath, buffer);

  // 6. Return relative URL
  return `/plans/${fileName}`;
}
