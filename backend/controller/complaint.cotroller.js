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
