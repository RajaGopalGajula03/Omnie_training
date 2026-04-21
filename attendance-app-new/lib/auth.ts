import { NextRequest, NextResponse } from "next/server";
import { employees, type Employee } from "@/lib/data";
import { verifyToken, type AuthTokenPayload } from "@/lib/jwt";

export const ADMIN_ROLES = ["Manager", "HR"] as const;

export type AppRole = Employee["role"];

export type SessionUser = Pick<Employee, "id" | "name" | "email" | "role">;

export function getUserById(id: number) {
  return employees.find((employee) => employee.id === id) ?? null;
}

export function toSessionUser(employee: Employee): SessionUser {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
  };
}

export function getRequestSession(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload === "string") {
    return null;
  }

  const employee = getUserById(payload.id);

  if (!employee) {
    return null;
  }

  return {
    token,
    payload: payload as AuthTokenPayload,
    user: toSessionUser(employee),
  };
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
