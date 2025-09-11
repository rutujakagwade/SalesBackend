import { Router } from "express";
import { protect } from "../middleware/protect.js";
import {
  createApproval,
  listApprovals,
  bulkApprove,
  updateApprovalStatus
} from "../controllers/approvalController.js";

const r = Router();

// Admin creates dummy approval (for testing in Postman)
r.post("/", protect(["admin"]), createApproval);

// List all approvals with filters
r.get("/", protect(["admin"]), listApprovals);

// Update single approval (approve/deny)
r.patch("/:id", protect(["admin"]), updateApprovalStatus);

// Bulk approve selected approvals
r.post("/bulk", protect(["admin"]), bulkApprove);

export default r;
