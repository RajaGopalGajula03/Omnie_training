import { generateAttendance } from "@/lib/data";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
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

     const attendance = generateAttendance(userId);

    const filtered = attendance.filter((a) => a.userId == userId && a.date.startsWith(month as string));

    return NextResponse.json(filtered);
}