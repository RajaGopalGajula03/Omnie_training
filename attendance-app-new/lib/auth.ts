import { NextRequest, NextResponse } from "next/server";
// import { employees, type Employee } from "@/lib/data";
import { verifyToken, type AuthTokenPayload } from "@/lib/jwt";
import { db } from "./db";
import { RowDataPacket } from "mysql2";

export const ADMIN_ROLES = ["Manager", "HR"] as const;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type RequestSession = {
  token: string;
  payload: AuthTokenPayload;
  user: SessionUser;
};

export async function getUserById(id: number): Promise<SessionUser | null> {
  const[rows] = await db.execute<RowDataPacket[]>(
    `SELECT id,name,email,role from employees WHERE id = ? AND deleted_at IS NULL AND is_active = TRUE
    `,[id]
  );
  return (rows[0] as SessionUser) ?? null;
}

// export function toSessionUser(employee: Employee): SessionUser {
//   return {
//     id: employee.id,
//     name: employee.name,
//     email: employee.email,
//     role: employee.role,
//   };
// }

export async function getRequestSession(req:NextRequest): Promise<RequestSession | null>  {
  const token = req.cookies.get("token")?.value;

  if(!token)
  {
    return null;
  }

  const payload = verifyToken(token);

  if(!payload || typeof payload === "string")
  {
    return null;
  }

  const employee =await getUserById(payload.id);

  if(!employee) return null;
  return{
    token,payload : payload as AuthTokenPayload, user : employee,
  }
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf-8");
}

export function getOptimisticSession(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const [, payloadPart] = token.split(".");

    if (!payloadPart) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadPart)) as AuthTokenPayload;

    if (!payload?.id || !payload?.role) {
      return null;
    }

    return {
      token,
      payload,
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    };
  } catch {
    return null;
  }
}

export function hasAnyRole(role: string, allowedRoles: readonly string[]) {
  return allowedRoles.includes(role);
}

export function unauthorizedJson(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbiddenJson(message = "Forbidden") {
  return NextResponse.json({ message }, { status: 403 });
}
