import { NextRequest } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
import { updateLeaveRequest } from "@/lib/dashboard-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can update leave status");
  }

  const { id } = await params;
  const body = await req.json();
  const updated = updateLeaveRequest(Number(id), {
    leaveType: body.leaveType,
    fromDate: body.fromDate,
    toDate: body.toDate,
    reason: body.reason,
    status: body.status,
  });

  if (!updated) {
    return Response.json({ message: "Leave request not found" }, { status: 404 });
  }

  return Response.json(updated);
}
