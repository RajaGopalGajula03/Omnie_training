// import { employees, addEmployee } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from 'bcrypt';


export async function GET(req: NextRequest) {
  const session =await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM employees WHERE id = ? AND deleted_at IS NULL", [session.user.id]
    )
    return NextResponse.json(rows);
  }

  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM employees");
  // console.log(rows);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest,) {
  const session =await getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only HR and Manager can add employees");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1"
    )

    let nextNumber = 1;
    if (rows.length > 0) {
      const lastCode = rows[0].employee_code;
      const numberPart = parseInt(lastCode.slice(3));
      nextNumber = numberPart + 1;
    }
    const body = await req.json();

    const { name, password, email, role, department_id } = body;

    if (!name || !password || !email || !role || !department_id) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const employee_code = `EMP${String(nextNumber).padStart(3, "0")}`;

    const id = session.user.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO employees (name,email,password_hash,employee_code,role,department_id,created_by,updated_by) VALUES(?,?,?,?,?,?,?,?)", [name, email, hashedPassword, employee_code, role, department_id, id, id]
    );

    return NextResponse.json({
      id: result.insertId,
      name, email, role, department_id, employee_code
    });
  }
  catch(error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
