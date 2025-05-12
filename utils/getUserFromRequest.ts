// utils/getUserFromRequest.ts
import { NextRequest } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

export function getUserFromRequest(req: NextRequest): DecodedToken {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new JsonWebTokenError("Authorization token required");
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error: any) {
    throw new JsonWebTokenError(error.message || "Invalid token");
  }
}
