import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
// import { updateAnnouncement } from "@/lib/dashboard-data";
import { ResultSetHeader } from "mysql2";
import { db } from "@/lib/db";

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
  const announcementId = Number(id);

  const body = await req.json();

  const { title, description, audience, publish_date, is_active, } = body;

  const formattedDate = publish_date.split("T")[0];

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE announcements SET title=?,description = ?,audience = ?, publish_date =?,is_active=?,updated_by=?
    where id = ? AND deleted_at is NULL`, [title, description, audience, formattedDate, is_active, session.user.id, announcementId]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json({ message: "Announcement not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Announcement updated successfully." })
}
