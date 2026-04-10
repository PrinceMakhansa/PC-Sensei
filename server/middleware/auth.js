import jwt from "jsonwebtoken";

/**
 * authenticate — verifies Bearer JWT, attaches req.user = { id, email, role }
 * Used on protected routes. Full auth flow (login/register) comes in auth week.
 */
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * requireRole — restricts route to specific roles after authenticate.
 * Usage: router.get("/admin", authenticate, requireRole("admin"), handler)
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

/**
 * optionalAuth — attaches req.user if token present, but doesn't block if missing.
 * Useful for routes that behave differently for logged-in vs guest users.
 */
export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
  } catch (_) {
    // silently ignore invalid tokens on optional routes
  }
  next();
};
