import { employees } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_ROLES,
    forbiddenJson,
    getRequestSession,
    hasAnyRole,
    unauthorizedJson,
} from "@/lib/auth";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const { id } = await params;
    const employeeId = Number(id);

    if (!hasAnyRole(session.user.role, ADMIN_ROLES) && session.user.id !== employeeId) {
        return forbiddenJson("You can only view your own profile");
    }

    const emp = employees.find((emp) => emp.id === employeeId);

    console.log("emp from id route:", emp)

    if (!emp) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...emp,
        projects: ["Project A", "Project B"],
    });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return forbiddenJson("Only HR and Manager can update employees");
    }

    const {id} = await params;
    const body = await req.json();

    const index = employees.findIndex((e) => e.id === Number(id));

    if (index === -1) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    employees[index] = {
        ...employees[index],
        ...body,
    };
    console.log("Updated employee",employees);
    return NextResponse.json(employees[index]);
}

export async function DELETE(req:NextRequest,{params}:RouteContext)
{
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return forbiddenJson("Only HR and Manager can delete employees");
    }

    const {id} = await params;

    const index = employees.findIndex((e)=>e.id === Number(id));

    if(index === -1)
    {
        return NextResponse.json({error:"Not found"},{status:404});
    }

    employees.splice(index,1);

    return NextResponse.json({message:"Deleted Successfully"});
}
