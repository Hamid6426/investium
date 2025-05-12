// middlewares/rateLimiters.ts

type RequestInfo = {
  count: number;
  lastRequestTime: number;
};

const passwordResetAttempts: Record<string, RequestInfo> = {};
const loginAttempts: Record<string, RequestInfo> = {};

const RATE_LIMIT_CONFIG = {
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
  },
  LOGIN: {
    windowMs: 60 * 60 * 1000,
    max: 5,
  },
};

function getClientIp(req: Request | { headers: Headers }): string {
  return req.headers.get("x-forwarded-for") || "unknown";
}

export function passwordResetLimiter(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();

  const entry = passwordResetAttempts[ip] || { count: 0, lastRequestTime: now };

  if (now - entry.lastRequestTime > RATE_LIMIT_CONFIG.PASSWORD_RESET.windowMs) {
    // Reset window
    entry.count = 1;
    entry.lastRequestTime = now;
  } else {
    entry.count += 1;
  }

  passwordResetAttempts[ip] = entry;

  if (entry.count > RATE_LIMIT_CONFIG.PASSWORD_RESET.max) {
    throw new Error("Too many password reset attempts. Try again after an hour.");
  }
}

export function loginAttemptsLimiter(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();

  const entry = loginAttempts[ip] || { count: 0, lastRequestTime: now };

  if (now - entry.lastRequestTime > RATE_LIMIT_CONFIG.LOGIN.windowMs) {
    // Reset window
    entry.count = 1;
    entry.lastRequestTime = now;
  } else {
    entry.count += 1;
  }

  loginAttempts[ip] = entry;

  if (entry.count > RATE_LIMIT_CONFIG.LOGIN.max) {
    throw new Error("Too many login attempts. Try again after an hour.");
  }
}
