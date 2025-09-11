import { Router } from "express";
import { protect } from "../middleware/protect.js";
import { addBalance, getBalance } from "../controllers/balanceController.js";

const r = Router();

// Add balance to a member
r.post("/:memberId", protect(["admin"]), addBalance);

// Get balance of a member
r.get("/:memberId", protect(["admin", "user"]), getBalance);

export default r;
