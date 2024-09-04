import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import Guest from "../model/guest.model.js";

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

export const addGuest = async (req, res) => {
    const { guestName, phoneNumber,numberOfGuest, checkInDate, checkOutDate } = req.body;
    const userId = req.user.userId;

    try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newGuest = new Guest({
            user: userId,
            guestName,
            phoneNumber,
            checkInDate,
            checkOutDate,
            verificationCode,
            numberOfGuest,
        });

        await newGuest.save();
        if (!req.user.email) {
            console.error('User email not found');
            return res.status(400).json({ error: 'User email not found. Unable to send verification code.' });
        }

        console.log('Attempting to send email to:', req.user.email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.user.email,
            subject: 'Guest Verification Code',
            text: `Your guest verification code is: ${verificationCode}`,
        });

        res.status(201).json({ message: 'Guest added. Check your email for the verification code.', guestId: newGuest._id });
    } catch (error) {
        console.error('Add guest error:', error);
        res.status(500).json({ error: 'An error occurred while adding the guest.', details: error.message });
    }
};

export const verifyGuest = async (req, res) => {
    const { guestId, verificationCode } = req.body;

    try {
        const guest = await Guest.findById(guestId);

        if (!guest) {
            return res.status(404).json({ error: 'Guest not found.' });
        }

        if (guest.verificationCode !== verificationCode) {
            return res.status(400).json({ error: 'Invalid verification code.' });
        }

        guest.isVerified = true;
        await guest.save();

        res.status(200).json({ message: 'Guest verified successfully.' });
    } catch (error) {
        console.error('Verify guest error:', error);
        res.status(500).json({ error: 'An error occurred while verifying the guest.' });
    }
};

export const getGuestList = async (req, res) => {
    const userId = req.user.userId;

    try {
        const guests = await Guest.find({ user: userId, isVerified: true });
        res.status(200).json(guests);
    } catch (error) {
        console.error('Get guest list error:', error);
        res.status(500).json({ error: 'An error occurred while fetching the guest list.' });
    }
};

export const deleteGuest = async (req, res) => {
    const guestId = req.params.id;
    const userId = req.user.userId;

    try {
        const guest = await Guest.findOne({ _id: guestId, user: userId });

        if (!guest) {
            return res.status(404).json({ error: 'Guest not found or you do not have permission to delete this guest.' });
        }

        await Guest.findByIdAndDelete(guestId);
        res.status(200).json({ message: 'Guest deleted successfully.' });
    } catch (error) {
        console.error('Delete guest error:', error);
        res.status(500).json({ error: 'An error occurred while deleting the guest.' });
    }
};
