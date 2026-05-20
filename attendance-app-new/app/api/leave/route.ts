import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
// import { createLeaveRequest, leaveRequests } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
        if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
            const [rows] = await db.execute<RowDataPacket[]>(`
            SELECT id,employee_id as employeeId, leave_type as leaveType, from_date as fromDate,
            to_date as toDate,total_days as days,reason,status,admin_remark as adminRemark from leave_requests WHERE employee_id = ? 
            AND deleted_at IS NULL  ORDER BY created_at DESC`, [session.user.id])

            return Response.json(rows);
        }

        const [rows] = await db.execute<RowDataPacket[]>(` SELECT id,employee_id as employeeId, 
            leave_type as leaveType, from_date as fromDate,to_date as toDate,total_days as days,
            reason,status,admin_remark as adminRemark from leave_requests WHERE 
            deleted_at IS NULL  ORDER BY created_at DESC`)

        return Response.json(rows);
    }

    if (
        !hasAnyRole(session.user.role, ADMIN_ROLES) &&
        Number(employeeId) !== session.user.id
    ) {
        return forbiddenJson("You can only view your own leave requests");
    }

    const [rows] = await db.execute<RowDataPacket[]>(`
        SELECT id,employee_id as employeeId, leave_type as leaveType,from_date as fromDate,
        to_date as toDate,total_days as days,reason,status,admin_remark as adminRemark from leave_requests WHERE employee_id = ? 
        AND deleted_at IS NULL ORDER BY created_at DESC`, [Number(employeeId)])

    return Response.json(rows);
}

export async function POST(req: NextRequest) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const body = await req.json();
    const employeeId = hasAnyRole(session.user.role, ADMIN_ROLES)
        ? Number(body.employeeId)
        : session.user.id;

    const totalDays = Math.ceil( (new Date(body.toDate).getTime() - new Date(body.fromDate).getTime()) / 
    (1000 * 60 * 60 *24)) + 1;

    const [result] = await db.execute<ResultSetHeader>(`
        INSERT INTO leave_requests (employee_id,leave_type,from_date,to_date,total_days,reason,status,created_by)
        VALUES (?,?,?,?,?,?,?,?)`, [employeeId, body.leaveType, body.fromDate, body.toDate,totalDays,body.reason, "pending",
        session.user.id,
    ])

    return Response.json({ message: "Leave Request Created Successfully", id: result.insertId },
        { status: 201 });
}
