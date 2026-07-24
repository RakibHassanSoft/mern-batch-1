import jwt from "jsonwebtoken";
import User from "./user.model.js";

// "protect" runs BEFORE a controller and blocks anyone who is not logged in.
// The token now lives in an httpOnly COOKIE (set at login), so we read it
// from req.cookies.token. We also accept an "Authorization: Bearer" header
// as a fallback, which is handy for quick manual testing.
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Prefer the cookie (this is how the browser sends it automatically)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback: an Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please log in" });
    }

    // 3. Verify the token was signed with OUR secret and isn't expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user to the request so controllers can use req.user
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next(); // everything is fine -> continue to the controller
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
