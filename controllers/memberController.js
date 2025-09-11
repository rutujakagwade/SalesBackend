import bcrypt from "bcryptjs";
import Member from "../models/Member.js";
import { signJWT } from "../utils/generateToken.js";

// =======================
// Complete Registration
// =======================
export const completeRegistration = async (req, res) => {
  const { email, password, token, name } = req.body;

  const member = await Member.findOne({ email });
  if (!member) return res.status(400).json({ message: "No member invite" });

  if (member.inviteToken !== token) return res.status(400).json({ message: "Invalid token" });

  member.password = await bcrypt.hash(password, 10);
  member.name = name;
  member.status = "active";
  member.inviteToken = null;
  await member.save();

  res.json({ message: "Registration completed" });
};

// =======================
// Member Login
// =======================
export const loginMember = async (req, res) => {
  const { email, password } = req.body;

  const member = await Member.findOne({ email });
  if (!member) return res.status(400).json({ message: "Invalid credentials" });

  if (member.status !== "active") return res.status(403).json({ message: "Account not active" });

  const ok = await bcrypt.compare(password, member.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = signJWT({ id: member._id, role: member.type });

  res.json({
    token,
    role: member.type,
    name: member.name,
    email: member.email,
  });
};
