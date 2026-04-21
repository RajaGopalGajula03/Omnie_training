import { employees, addEmployee } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ROLES,
  forbiddenJson,
  getRequestSession,
  hasAnyRole,
  unauthorizedJson,
} from "@/lib/auth";



export async function GET(req:NextRequest){
    const session = getRequestSession(req);

    if(!session){
        return unauthorizedJson();
    }

    if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return NextResponse.json([session.user]);
    }

    return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only HR and Manager can add employees");
  }

  const body = await req.json();

  const newEmployee = addEmployee(body);

  return NextResponse.json(newEmployee);
}
