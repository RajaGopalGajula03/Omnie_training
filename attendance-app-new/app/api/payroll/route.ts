import { NextRequest } from "next/server";
import {ADMIN_ROLES,forbiddenJson,getRequestSession,hasAnyRole,unauthorizedJson,} from "@/lib/auth";
import { createPayrollItem, payrollItems } from "@/lib/dashboard-data";

export async function GET(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return Response.json(payrollItems);
  }

  return Response.json(payrollItems.filter((item) => item.employeeId === session.user.id));
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can create payroll items");
  }

  const body = await req.json();

  const payrollItem = createPayrollItem({
    employeeId: Number(body.employeeId),
    month: body.month,
    status: body.status,
    amount: Number(body.amount),
  });

  return Response.json(payrollItem, { status: 201 });
}
