import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const protect = (roles = []) => async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const member = await Member.findById(decoded.id);
    if (!member) return res.status(401).json({ message: "Member not found" });

    if (roles.length && !roles.includes(member.type))
      return res.status(403).json({ message: "Access denied" });

    req.member = member;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
