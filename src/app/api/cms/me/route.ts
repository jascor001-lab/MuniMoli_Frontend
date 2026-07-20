import { NextResponse } from "next/server";
import { getCmsSession } from "@/lib/cms/session";
import { findUserByUsername, publicUser, readUsers } from "@/lib/cms/users-store";

export async function GET() {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const fresh =
    findUserByUsername(session.username) ??
    readUsers().find((user) => user.id === session.id);
  if (!fresh || !fresh.active) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: publicUser(fresh) });
}
