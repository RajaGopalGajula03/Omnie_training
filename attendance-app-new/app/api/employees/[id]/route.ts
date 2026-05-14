// import { employees } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const { id } = await params;
    const employeeId = Number(id);

    if (!hasAnyRole(session.user.role, ADMIN_ROLES) && session.user.id !== employeeId) {
        return forbiddenJson("You can only view your own profile");
    }

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id, employee_code, name, email, role, department_id, is_active, join_date FROM employees 
        where id = ? AND deleted_at IS NULL`, [employeeId]
    );
    if (rows.length === 0) {
        return NextResponse.json({ message: "Employee Not Found" }, { status: 404 });
    }
    const employee = rows[0];
    // const emp = employees.find((emp) => emp.id === employeeId);

    // console.log("emp from id route:", employee)  

    // if (!employee) {
    //     return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    // }

    return NextResponse.json({
        ...employee,
        projects: ["Project A", "Project B"],
    });
}

const roleDepartmentMap: Record<string, number> = {
    "Trainee": 1,
    "Jr Developer": 1,
    "Software Engineer": 1,
    "Senior Developer": 1,
    "Manager": 3,
    "HR": 2,
};
export async function PUT(req: NextRequest, { params }: RouteContext) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return forbiddenJson("Only HR and Manager can update employees");
    }

    const { id } = await params;
    const body = await req.json();
    const employeeId = Number(id);


    const { name, email, role } = body;
    const department_id = roleDepartmentMap[role];

    if (!department_id) {
        return NextResponse.json({ message: "Invalid role selected" }, { status: 400 })
    }

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE employees SET name = ?, email = ?, role = ?, department_id = ?, updated_by = ? WHERE id = ? AND deleted_at IS NULL`,
        [name, email, role, department_id, session.user.id, employeeId]
    )
    if (result.affectedRows === 0) {
        return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated Successfully" });



    // const index = employees.findIndex((e) => e.id === Number(id));

    // if (index === -1) {
    //     return NextResponse.json({ message: "Not found" }, { status: 404 });
    // }

    // employees[index] = {
    //     ...employees[index],
    //     ...body,
    // };
    // console.log("Updated employee",employees);
    // return NextResponse.json(employees[index]);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    const session =await getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return forbiddenJson("Only HR and Manager can delete employees");
    }

    const { id } = await params;
    const employeeId = Number(id);

    if (session.user.id === employeeId) {
        return forbiddenJson("You cannot delete your own account");
    }

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE employees SET deleted_at = NOW(), is_active = FALSE, updated_by = ? 
   WHERE id = ? AND deleted_at IS NULL`,
        [session.user.id, employeeId]
    );

    if (result.affectedRows === 0) {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deleted Successfully" })

    // const index = employees.findIndex((e) => e.id === Number(id));

    // if (index === -1) {
    //     return NextResponse.json({ error: "Not found" }, { status: 404 });
    // }

    // employees.splice(index, 1);

    // return NextResponse.json({ message: "Deleted Successfully" });
}
