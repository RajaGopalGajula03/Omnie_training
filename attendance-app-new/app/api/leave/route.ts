import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson } from "@/lib/auth";
import { createLeaveRequest, leaveRequests } from "@/lib/dashboard-data";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
        if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
            return Response.json(
                leaveRequests.filter((item) => item.employeeId === session.user.id)
            );
        }

        return Response.json(leaveRequests);
    }

    if (
        !hasAnyRole(session.user.role, ADMIN_ROLES) &&
        Number(employeeId) !== session.user.id
    ) {
        return forbiddenJson("You can only view your own leave requests");
    }

    return Response.json(
        leaveRequests.filter((item) => item.employeeId === Number(employeeId))
    );
}

export async function POST(req: NextRequest) {
    const session = getRequestSession(req);

    if (!session) {
        return unauthorizedJson();
    }

    const body = await req.json();
    const employeeId = hasAnyRole(session.user.role, ADMIN_ROLES)
        ? Number(body.employeeId)
        : session.user.id;

    const leave = createLeaveRequest({
        employeeId,
        leaveType: body.leaveType,
        fromDate: body.fromDate,
        toDate: body.toDate,
        reason: body.reason,
    });

    return Response.json(leave, { status: 201 });
}
