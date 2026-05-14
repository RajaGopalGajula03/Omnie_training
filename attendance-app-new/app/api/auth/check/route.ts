import { NextRequest, NextResponse } from "next/server";
import { getRequestSession,RequestSession } from "@/lib/auth";

export async function GET(req:NextRequest) {
const session: RequestSession | null = await getRequestSession(req);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}
