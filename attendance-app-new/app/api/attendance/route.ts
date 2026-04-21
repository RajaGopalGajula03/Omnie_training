import { generateAttendance } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";



export async function GET(req: NextRequest) {
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const { searchParams } = new URL(req.url);

    const userIdParam = searchParams.get("userId");
    const month = searchParams.get("month");

    if (!userIdParam || !month) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const userId = Number(userIdParam);

    if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES) && session.user.id !== userId) {
        return forbiddenJson("You can only view your own attendance");
    }

     const attendance = generateAttendance(userId);

    const filtered = attendance.filter((a) => a.userId == userId && a.date.startsWith(month as string));

    return NextResponse.json(filtered);
}
