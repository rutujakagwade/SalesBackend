import { Router } from "express";
import { registerAdmin, loginAdmin, addMember, listMembers } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.post("/members/add", protect(["admin"]), addMember);
router.get("/members", protect(["admin"]), listMembers);

export default router;
