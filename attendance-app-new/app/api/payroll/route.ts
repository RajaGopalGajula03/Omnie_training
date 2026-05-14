import { NextRequest, NextResponse } from "next/server";
import {ADMIN_ROLES,forbiddenJson,getRequestSession,hasAnyRole,unauthorizedJson,} from "@/lib/auth";
// import { createPayrollItem, payrollItems } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export async function GET(req: NextRequest) {
  const session =await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  // admin can see all payrolls
  if (hasAnyRole(session.user.role, ADMIN_ROLES)) {
    
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id,employee_id as employeeId, payroll_month as month,status,amount FROM payrolls ORDER BY id DESC`
    );
    return NextResponse.json(rows);
  }

  // employee can see own payroll 
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM payrolls WHERE employee_id = ? ORDER BY id DESC`,[session.user.id]
  );

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session =await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can create payroll items");
  }

  const body = await req.json();
  
  // console.log("payroll route body",body);

  const [ressult] = await db.execute<ResultSetHeader>(
    `INSERT INTO payrolls (employee_id,payroll_month,status,amount) VALUES(?,?,?,?)`,
    [Number(body.employeeId),body.month,body.status,Number(body.amount)]
  );

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM payrolls WHERE id = ?`,[ressult.insertId]
  );
  
  return Response.json(rows[0], { status: 201 });
}
