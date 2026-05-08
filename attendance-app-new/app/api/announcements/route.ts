import { NextRequest, } from "next/server";
import { ADMIN_ROLES, forbiddenJson, getRequestSession, hasAnyRole, unauthorizedJson, } from "@/lib/auth";
// import { announcements, createAnnouncement, getVisibleAnnouncements } from "@/lib/dashboard-data";
import { ResultSetHeader, RowDataPacket } from "mysql2";
// import { PublicSharp } from "@mui/icons-material";
// import { isatty } from "tty";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getRequestSession(req);

  if (!session) {
    return unauthorizedJson();
  }

  let query = `SELECT id,title,description,audience,publish_date,is_active FROM announcements
  WHERE deleted_at IS NULL and is_active = TRUE`;

  if(!hasAnyRole(session.user.role,ADMIN_ROLES))
  {
    query +=` AND (audience = 'all' or audience = 'employee')`;
  }

  query += ` ORDER BY publish_date DESC`;

  const [rows] =await db.execute<RowDataPacket[]>(query);

  return Response.json(rows);
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

  const{title,description,audience,publish_date,is_active} = body;

  const[result] = await db.execute<ResultSetHeader>(
    `INSERT INTO announcements(title,description,audience,publish_date,is_active,created_by)
    VALUES (?,?,?,?,?,?)`,[title,description,audience,publish_date,is_active,session.user.id]
  );

  return Response.json({message:"Announcement created successfully",id:result.insertId,},{status:201});
}
