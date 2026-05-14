import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
// import { updateLeaveRequest } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";


type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can update leave status");
  }

  const { id } = await params;

  const leaveId = Number(id);

  if (Number.isNaN(leaveId)) {
    return NextResponse.json({ message: "Invalid leave Id" }, { status: 400 });
  }

  const body = await req.json();


  const isStatusOnlyUpdate = body.status && !body.leaveType;

  if (isStatusOnlyUpdate) {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE leave_requests
    SET status = ?, approved_by = ?, approved_at = NOW(), updated_by = ?
    WHERE id = ? AND deleted_at IS NULL`,
      [body.status, session.user.id, session.user.id, leaveId,]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Leave request not found" },
        { status: 404 }
      );
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM leave_requests WHERE id = ?`,
      [leaveId]
    );

    return NextResponse.json(rows[0]);
  }


  if (!body.leaveType || !body.fromDate || !body.toDate || !body.reason) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const from = new Date(body.fromDate);
  const to = new Date(body.toDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json(
      { message: "Invalid date format" },
      { status: 400 }
    );
  }

  const totalDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const approvedBy = body.status === "approved" ? session.user.id : null;


  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE leave_requests SET leave_type = ?,from_date = ?, to_date = ?, total_days = ?, reason = ?,
    status = ?, approved_by = ?, approved_at = NOW(), admin_remark = ?, updated_by = ? WHERE id = ?
    AND deleted_at IS NULL`, [body.leaveType, body.fromDate, body.toDate, totalDays, body.reason, body.status,
    approvedBy, body.adminRemark ?? null, session.user.id, leaveId]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json({ message: "Leave Request not found" }, { status: 404 });
  }

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM leave_requests WHERE id = ?`,
    [leaveId]
  );

  return NextResponse.json(rows[0]);
}
