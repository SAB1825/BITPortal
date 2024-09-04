import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  houseNumber: { type: String, required: true },
  description: { type: String, required: true },
  serviceTime: { type: Date, required: true },
  mobileNumber: {type: String, required: true},
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Resolved'] },
  imageUrl: { type: String }
}, {
  timestamps: true
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
