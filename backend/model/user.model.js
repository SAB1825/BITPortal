import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },
    profileImage: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    bloodGroup: { type: String },
    aadharNumber: { type: String },
    vehicleNumber: { type: String },
    dateOfBirth: { type: Date },
    department: { type: String },
    permanentAddress: { type: String },
    age: { type: Number },
    profileCompleted: { type: Boolean, default: false },
    phoneNumber: { type: String },
    quarterNumber: {type: String},
    quarterName: {type: String},
    inmates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inmates' }]
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);
export default User;