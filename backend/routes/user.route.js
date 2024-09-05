import express from "express";
import { register, signin, verify, forgotPassword, resetPassword, verifyResetCode, updateProfile, getUserProfile, uploadProfileImage } from "../controller/auth.controller.js";
import { addInmate, getInmates, deleteInmate, updateInmate } from "../controller/inmates.controller.js"; // Import deleteInmate
import { verifyToken, isAdmin } from '../middleware/middleware.js';
import { upload } from "../middleware/upload.js";
import { addGuest, verifyGuest, getGuestList, deleteGuest } from "../controller/guest.controller.js";
import { getAllUsers, deleteUser } from "../controller/user.controller.js";
import { createComplaint, getComplaintStats, getUserComplaints, getAllComplaints, updateComplaintStatus } from "../controller/complaint.cotroller.js";
import { getAllGuests, updateGuestCheckInOut } from "../controller/guest.controller.js";
import { createAnnouncement, getAnnouncements } from "../controller/announcement.controller.js";

const router = express.Router();

// Use router.use() to apply middleware to all routes EXCEPT /verify

// Now define your routes
router.post("/signin", signin);
router.post("/register", register);
router.post("/verify", verify); // Removed verifyToken middleware
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
router.get("/complaint-stats", verifyToken, getComplaintStats);

// Guest routes
router.post("/guests", verifyToken, addGuest);
router.post("/guests/verify", verifyToken, verifyGuest);
router.get("/guests", verifyToken, getGuestList);
router.delete("/guests/:id", verifyToken, deleteGuest);

// Staff management routes
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// Admin guest routes
router.get("/admin/guests", verifyToken, isAdmin, getAllGuests);
router.put("/admin/guests/:id/:action", verifyToken, isAdmin, updateGuestCheckInOut);

// New routes for staff management


router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Admin complaint routes
router.get("/admin/complaints", verifyToken, isAdmin, getAllComplaints);
router.put("/admin/complaints/:id", verifyToken, isAdmin, updateComplaintStatus);

// Announcement routes
router.post("/admin/announcements", verifyToken, isAdmin, createAnnouncement);
router.get("/announcements", verifyToken, getAnnouncements);

export default router;