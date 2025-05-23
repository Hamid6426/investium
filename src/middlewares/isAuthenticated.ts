import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

export function isAuthenticated(allowedRoles: string[]) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized: No token provided." },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];

      // Verify the token
      const secret = process.env.JWT_SECRET || "your_jwt_secret";
      const decoded = jwt.verify(token, secret) as DecodedToken;

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json(
          { error: "Forbidden: You do not have access to this resource." },
          { status: 403 }
        );
      }

      // Attach user info to the request (optional)
      req.headers.set("userId", decoded.id);
      req.headers.set("userRole", decoded.role);

      return NextResponse.next();
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }
  };
}