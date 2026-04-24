import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
import {
    checkInEmployee,
    checkOutEmployee,
    type AttendanceRecord,
    getCurrentDateKey,
    upsertAttendanceRecord,
} from "@/lib/data";
import { getEmployeeAttendanceRecords } from "@/lib/dashboard-data";



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

     const attendance = getEmployeeAttendanceRecords(userId);

    const filtered = attendance.filter((a) => a.userId == userId && a.date.startsWith(month as string));

    return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const body = await req.json();

    if (body.action === "check-in") {
        const todayRecord = getEmployeeAttendanceRecords(session.user.id).find(
            (item) => item.date === getCurrentDateKey()
        );

        if (todayRecord?.status === "leave" || todayRecord?.status === "holiday") {
            return NextResponse.json(
                { message: `You cannot check in on a ${todayRecord.status} day.` },
                { status: 400 }
            );
        }

        const record = checkInEmployee(session.user.id);
        return NextResponse.json(record);
    }

    if (body.action === "check-out") {
        const todayRecord = getEmployeeAttendanceRecords(session.user.id).find(
            (item) => item.date === getCurrentDateKey()
        );

        if (todayRecord?.status === "leave" || todayRecord?.status === "holiday") {
            return NextResponse.json(
                { message: `You cannot check out on a ${todayRecord.status} day.` },
                { status: 400 }
            );
        }

        const record = checkOutEmployee(session.user.id);
        return NextResponse.json(record);
    }

    if (body.action === "admin-update") {
        if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
            return forbiddenJson("Only admin can edit attendance");
        }

        const userId = Number(body.userId);

        if (Number.isNaN(userId) || !body.date) {
            return NextResponse.json({ message: "Invalid attendance update" }, { status: 400 });
        }

        const record: AttendanceRecord = {
            userId,
            date: body.date,
            checkIn: body.checkIn || null,
            checkOut: body.checkOut || null,
            status: body.status,
        };

        return NextResponse.json(upsertAttendanceRecord(record));
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
