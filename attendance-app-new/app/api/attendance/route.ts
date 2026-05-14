import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
// import { checkInEmployee, checkOutEmployee, type AttendanceRecord, upsertAttendanceRecord, } from "@/lib/data";
// import { getEmployeeAttendanceRecords } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export async function GET(req: NextRequest) {
    const session =await getRequestSession(req);

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

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id,employee_id AS userId,DATE_FORMAT(attendance_date,'%Y-%m-%d') AS date,
        check_in AS checkIn,check_out AS checkOut,status FROM attendance_records
        WHERE employee_id = ? AND DATE_FORMAT(attendance_date,'%Y-%m') = ? AND deleted_at IS NULL 
        ORDER BY attendance_date DESC`, [userId, month]
    )

    return NextResponse.json(rows);
}

function getCurrentDateKey() {
    return new Date().toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const body = await req.json();

    if (body.action === "check-in") {

        const today = getCurrentDateKey();

        const [rows] = await db.execute<RowDataPacket[]>(`
            SELECT status,check_in AS checkIn FROM attendance_records WHERE employee_id = ?
            AND attendance_date = ? AND deleted_at IS NULL`, [session.user.id, today]);

        const todayRecord = rows[0];

        if (todayRecord?.status === "leave" || todayRecord?.status === "holiday") {
            return NextResponse.json({ message: `You cannot check in on a ${todayRecord.status} day.` }, { status: 400 });
        }
        if (todayRecord?.checkIn) {
            return NextResponse.json({ message: "Alredy Checked in" }, { status: 400 });
        }

        await db.execute<ResultSetHeader>(`
            INSERT INTO attendance_records(employee_id,attendance_date,check_in,status) VALUES(?,?,CURRENT_TIME(),'present') ON DUPLICATE KEY UPDATE
            check_in = CURRENT_TIME(),status ='present'`, [session.user.id, today])

        return NextResponse.json({ message: "Checked In Successfully" })
    }

    if (body.action === "check-out") {
        const today = getCurrentDateKey();

        const [rows] = await db.execute<RowDataPacket[]>(
            `SELECT status,check_in,check_out FROM attendance_records WHERE employee_id = ? AND attendance_date = ?
       AND deleted_at IS NULL`, [session.user.id, today]
        );

        const todayRecord = rows[0];

        if (
            todayRecord?.status === "leave" ||
            todayRecord?.status === "holiday"
        ) {
            return NextResponse.json(
                {
                    message: `You cannot check out on a ${todayRecord.status} day.`,
                },
                { status: 400 }
            );
        }

        if (!todayRecord?.check_in) {
            return NextResponse.json(
                { message: "Check in first." },
                { status: 400 }
            );
        }

        if (todayRecord?.check_out) {
            return NextResponse.json(
                { message: "Already checked out." },
                { status: 400 }
            );
        }

        await db.execute<ResultSetHeader>(
            `UPDATE attendance_records SET check_out = CURRENT_TIME() WHERE employee_id = ? AND attendance_date = ?
       AND deleted_at IS NULL`, [session.user.id, today]
        );

        return NextResponse.json({
            message: "Checked out successfully",
        });
    }

    if (body.action === "admin-update") {
        if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
            return forbiddenJson("Only admin can edit attendance");
        }

        const userId = Number(body.userId);

        if (Number.isNaN(userId) || !body.date) {
            return NextResponse.json(
                { message: "Invalid attendance update" },
                { status: 400 }
            );
        }

        await db.execute<ResultSetHeader>(
            `INSERT INTO attendance_records (employee_id,attendance_date,check_in,check_out,status,updated_by)
       VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE check_in = VALUES(check_in), check_out = VALUES(check_out),
       status = VALUES(status), updated_by = VALUES(updated_by)`,
            [userId, body.date, body.checkIn || null, body.checkOut || null, body.status, session.user.id,]
        );

        return NextResponse.json({
            message: "Attendance updated successfully",
        });
    }

    return NextResponse.json(
        { message: "Invalid action" },
        { status: 400 }
    );
}