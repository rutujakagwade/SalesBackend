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

    // Move this here, after getting name and email from req.body
   const memberName = name || email.split("@")[0]; // fallback if name is missing

    const member = await Member.create({
      name: memberName,
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
        <p><b>Name:</b> ${memberName}</p>
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

export const getAdminProfile = async (req, res) => {
  try {
    // Use Member model instead of Admin
    const admin = await Member.findById(req.user.id).select("-password");

    // Optionally ensure the type is admin
    if (!admin || admin.type !== "admin") 
      return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const updatedAdmin = await Member.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin || updatedAdmin.type !== "admin")
      return res.status(404).json({ message: "Admin not found" });

    res.json(updatedAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
