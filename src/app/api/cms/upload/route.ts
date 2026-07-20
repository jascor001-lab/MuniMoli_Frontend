import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { getCmsSession } from "@/lib/cms/session";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export async function POST(request: Request) {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes (JPG, PNG, WEBP, GIF) o PDF" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera 12 MB" },
        { status: 400 },
      );
    }

    const kind = file.type.startsWith("image/") ? "images" : "docs";
    const dir = path.join(process.cwd(), "public", "uploads", "cms", kind);
    fs.mkdirSync(dir, { recursive: true });

    const safeBase = file.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)
      .toLowerCase();
    const id = randomBytes(4).toString("hex");
    const filename = `${safeBase || "archivo"}-${id}.${EXT[file.type]}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(dir, filename), buffer);

    const url = `/uploads/cms/${kind}/${filename}`;
    return NextResponse.json({
      ok: true,
      url,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch {
    return NextResponse.json({ error: "No se pudo subir el archivo" }, { status: 500 });
  }
}
