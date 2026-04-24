import { NextRequest } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
import { updateAnnouncement } from "@/lib/dashboard-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can edit announcements");
  }

  const { id } = await params;
  const body = await req.json();
  const updated = updateAnnouncement(Number(id), {
    title: body.title,
    description: body.description,
    audience: body.audience,
    date: body.date,
  });

  if (!updated) {
    return Response.json({ message: "Announcement not found" }, { status: 404 });
  }

  return Response.json(updated);
}
