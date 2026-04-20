import { generateAttendance  } from "@/lib/data";
import { NextResponse } from "next/server";



export async function GET(req:Request){
    const{ searchParams} = new URL(req.url);

    const userIdParam = searchParams.get("userId");
    const month = searchParams.get("month");

    const userId = userIdParam ? Number(userIdParam) : null;

    const data = generateAttendance(userId);
    const attendance = data;

    const filtered = attendance.filter((a)=> a.userId == userId && a.date.startsWith(month as string));

    return NextResponse.json(filtered);
}