import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { uploadToS3 } from '../middleware/upload.js';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken
    }
});

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Received registration request:', { username, email });
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            role: 'user',
            verificationCode,
        });

        await newUser.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            text: `Your verification code is: ${verificationCode}`,
        });

        console.log('User registered successfully:', newUser);
        res.status(201).json({ success: true, message: 'User registered. Check your email for the verification code.' });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
};

export const verify = async (req, res) => {
    console.log('Verify function called');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ error: 'Invalid email address.' });
        }
        if (user.verificationCode !== verificationCode) {
            console.log('Invalid verification code for user:', email);
            return res.status(400).json({ error: 'Invalid verification code.' });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        console.log('User verified successfully:', email);
        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).json({ error: 'Verification failed.' });
    }
};

export const signin = async (req, res) => {
    console.log('Signin function called');
    console.log('Request body:', req.body);
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('Signin successful for user:', email);
        // Send the response with user info and token
        res.status(200).json({
            message: 'Sign in successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            },
            token
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ error: 'An error occurred during sign in' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      user.resetPasswordCode = verificationCode;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${verificationCode}. It will expire in 1 hour.`,
      });
  
      res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ error: 'An error occurred during password reset request.' });
    }
  };
  
export const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    try {
      const user = await User.findOne({
        email,
        resetPasswordCode: code,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset code' });
      }
  
      res.status(200).json({ message: 'Reset code verified successfully' });
    } catch (err) {
      console.error('Verify reset code error:', err);
      res.status(500).json({ error: 'An error occurred during code verification.' });
    }
  };
  
export const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
      const user = await User.findOne({
        email,
        resetPasswordCode: code,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset code' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'An error occurred during password reset.' });
    }
  };
  

export const updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId; // Assuming you have middleware that sets req.user
      const {
        firstName,
        lastName,
        bloodGroup,
        aadharNumber,
        vehicleNumber,
        dateOfBirth,
        department,
        permanentAddress,
        age,
        phoneNumber,
        quarterNumber,
        quarterName,
      } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          bloodGroup,
          aadharNumber,
          vehicleNumber,
          dateOfBirth,
          department,
          permanentAddress,
          age,
          phoneNumber,
          quarterNumber,
          quarterName,
          profileCompleted: true
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
          profileCompleted: updatedUser.profileCompleted
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'An error occurred during profile update' });
    }
  };
  

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password -verificationCode -resetPasswordCode -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user profile' });
    }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Upload the image to S3 using the new uploadToS3 function
    const imageUrl = await uploadToS3(req.file);

    // Update user with new profile image URL
    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ error: 'An error occurred during profile image upload' });
  }
};