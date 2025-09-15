import { Router } from "express";
import { registerAdmin, loginAdmin, addMember, listMembers, getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.post("/members/add", protect(["admin"]), addMember);
router.get("/members", protect(["admin"]), listMembers);

// ✅ Add this route for getting current admin profile
router.get("/profile", protect(["admin"]), getAdminProfile);


// ✅ Add this route for updating admin profile
router.put("/profile", protect(["admin"]), updateAdminProfile);

export default router;
