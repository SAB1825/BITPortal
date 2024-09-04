import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  numberOfGuest: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Guest = mongoose.model("Guest", GuestSchema);
export default Guest;