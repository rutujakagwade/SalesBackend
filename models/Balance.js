import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    amount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Balance", balanceSchema);
