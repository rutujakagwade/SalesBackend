import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["admin", "user"], required: true },
    inviteToken: { type: String, required: null },
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
