import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES,forbiddenJson,getRequestSession, hasAnyRole,unauthorizedJson,} from "@/lib/auth";
// import { updatePayrollItem } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session =await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can edit payroll items");
  }

  const { id } = await params;

  const body = await req.json();

 const [result] = await db.execute<ResultSetHeader>(
  `UPDATE payrolls SET employee_id = ?,payroll_month = ?,status = ?, amount = ? WHERE id = ?`,
  [Number(body.employeeId),body.month,body.status,Number(body.amount),id]
 );

  if (result.affectedRows === 0) {
    return Response.json({ message: "Payroll item not found" }, { status: 404 });
  }

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM payrolls WHERE id = ?`,[id]
  );

  const row = rows[0];

  return NextResponse.json({id:row.id,employeeId:row.employee_id,month:row.payroll_month,status:row.status,amount:row.amount});
}
