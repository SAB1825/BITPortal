import express from "express";
import { register, signin, verify, forgotPassword, resetPassword, verifyResetCode, updateProfile, getUserProfile, uploadProfileImage } from "../controller/auth.controller.js";
import { addInmate, getInmates, deleteInmate, updateInmate } from "../controller/inmates.controller.js"; // Import deleteInmate
import { verifyToken } from '../middleware/middleware.js';
import { upload } from "../middleware/upload.js";
import { createComplaint, getUserComplaints } from "../controller/complaint.cotroller.js";
import { addGuest, verifyGuest, getGuestList, deleteGuest } from "../controller/guest.controller.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/register", register);
router.post("/verify", verify);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.post("/profile", verifyToken, updateProfile);
router.post("/profile-image", verifyToken, upload.single('profileImage'), uploadProfileImage);

router.get("/profile", verifyToken, getUserProfile);
router.post("/inmates", verifyToken, addInmate);
router.get("/inmates", verifyToken, getInmates);


// Inmates Route
router.post("/inmates", verifyToken, addInmate);
router.get("/inmates", verifyToken, getInmates);
router.delete("/inmates/:id", verifyToken, deleteInmate); // New route for deleting an inmate
router.put("/inmates/:id", verifyToken, updateInmate); // New route for updating an inmate
router.delete("/inmates/:id", verifyToken, deleteInmate);

// Complaint Rutes
router.post("/complaints", verifyToken, upload.single('image'), createComplaint);
router.get("/complaints", verifyToken, getUserComplaints);

// Guest routes
router.post("/guests", verifyToken, addGuest);
router.post("/guests/verify", verifyToken, verifyGuest);
router.get("/guests", verifyToken, getGuestList);
router.delete("/guests/:id", verifyToken, deleteGuest);

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

export default router;