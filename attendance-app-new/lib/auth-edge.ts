import { NextRequest } from "next/server";
import type { AuthTokenPayload } from "@/lib/jwt";

export const ADMIN_ROLES = ["Manager", "HR"] as const;

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");

  const padded = normalized.padEnd(
    Math.ceil(normalized.length / 4) * 4,
    "="
  );

  return atob(padded);
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

    const payload = JSON.parse(
      decodeBase64Url(payloadPart)
    ) as AuthTokenPayload;

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

export function hasAnyRole(
  role: string,
  allowedRoles: readonly string[]
) {
  return allowedRoles.includes(role);
}