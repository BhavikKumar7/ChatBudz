import express from "express";
import { login, logout, signup, onboard, updateProfile } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);
router.patch("/update-profile", protectRoute, updateProfile);

router.get("/me", protectRoute, (req, res)=>{
    try{
        res.status(200).json({ success: true, user: req.user});
    }catch(error){
        res.status(500).json({msg: "Internal server error"});
    }
});

export default router;