import { NextRequest } from "next/server";
import {
  ADMIN_ROLES,
  forbiddenJson,
  getRequestSession,
  hasAnyRole,
  unauthorizedJson,
} from "@/lib/auth";
import { updatePayrollItem } from "@/lib/dashboard-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can edit payroll items");
  }

  const { id } = await params;
  const body = await req.json();
  const updated = updatePayrollItem(Number(id), {
    employeeId: body.employeeId ? Number(body.employeeId) : undefined,
    month: body.month,
    status: body.status,
    amount: body.amount !== undefined ? Number(body.amount) : undefined,
  });

  if (!updated) {
    return Response.json({ message: "Payroll item not found" }, { status: 404 });
  }

  return Response.json(updated);
}
