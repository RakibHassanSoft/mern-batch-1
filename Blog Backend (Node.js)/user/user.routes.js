import express from "express";
import { register, login, logout, getMe } from "./user.controller.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register); // create an account (sets cookie)
router.post("/login", login);       // log in (sets cookie)
router.post("/logout", logout);     // log out (clears cookie)
router.get("/me", protect, getMe);  // who am I? (needs cookie)

export default router;
