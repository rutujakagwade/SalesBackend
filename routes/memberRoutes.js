import { Router } from "express";
import { completeRegistration, loginMember } from "../controllers/memberController.js";

const router = Router();

router.post("/register", completeRegistration);
router.post("/login", loginMember);

export default router;
