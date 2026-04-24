import { NextRequest } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
import { announcements, createAnnouncement, getVisibleAnnouncements } from "@/lib/dashboard-data";

export async function GET(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return Response.json(announcements);
  }

  return Response.json(getVisibleAnnouncements(false));
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  if (!hasAnyRole(session.user.role, ADMIN_ROLES)) {
    return forbiddenJson("Only admin roles can create announcements");
  }

  const body = await req.json();

  const announcement = createAnnouncement({
    title: body.title,
    description: body.description,
    audience: body.audience,
    date: body.date,
  });

  return Response.json(announcement, { status: 201 });
}
