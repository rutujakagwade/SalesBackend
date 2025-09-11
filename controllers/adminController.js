import bcrypt from "bcryptjs";
import Member from "../models/Member.js";
import { signJWT, randomInvite } from "../utils/generateToken.js";
import { sendCredentials } from "../utils/sendEmail.js";

// =======================
// Register Admin
// =======================
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const admin = await Member.create({
      name,
      email,
      password: hash,
      type: "admin",
      status: "active",
      inviteToken: null,
    });

    res.status(201).json({ message: "Admin registered", id: admin._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =======================
// Admin Login
// =======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, member.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (member.status !== "active") return res.status(403).json({ message: "Account not active" });

    const token = signJWT({ id: member._id, role: member.type });

    res.json({
      token,
      role: member.type,
      name: member.name,
      email: member.email,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =======================
// List Members
// =======================
export const listMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Add Member
// =======================
export const addMember = async (req, res) => {
  try {
    const { email, password, type, name } = req.body;

    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const inviteToken = randomInvite();
    const hash = await bcrypt.hash(password, 10);

    const member = await Member.create({
      name,
      email,
      password: hash,
      type,
      inviteToken,
      status: "pending",
    });

    await sendCredentials({
      to: email,
      subject: "Your CASE account invitation",
      html: `
        <h3>Welcome to CASE</h3>
        <p>Your account was created by Admin.</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p><b>Token:</b> ${inviteToken}</p>
      `,
    });

    res.status(201).json({ message: "Member invited", id: member._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
