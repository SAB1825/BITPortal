import Complaint from "../model/complaint.model.js";
import { uploadToS3 } from '../middleware/upload.js';

export const createComplaint = async (req, res) => {
  try {
    const { houseNumber, description, serviceTime, mobileNumber } = req.body;
    const userId = req.user.userId;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const newComplaint = new Complaint({
      user: userId,
      houseNumber,
      description,
      mobileNumber,
      serviceTime: new Date(serviceTime),
      imageUrl
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint created successfully', complaint: newComplaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'An error occurred while creating the complaint' });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.userId;
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({ error: 'An error occurred while fetching complaints' });
  }
};

export const getComplaintStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const total = await Complaint.countDocuments({ user: userId });
    const resolved = await Complaint.countDocuments({ user: userId, status: 'Resolved' });
    const pending = await Complaint.countDocuments({ user: userId, status: { $ne: 'Resolved' } });

    res.status(200).json({ total, resolved, pending });
  } catch (error) {
    console.error('Get complaint stats error:', error);
    res.status(500).json({ error: 'An error occurred while fetching complaint statistics' });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ error: 'An error occurred while fetching complaints' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint status updated successfully', complaint: updatedComplaint });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ error: 'An error occurred while updating the complaint status' });
  }
};
