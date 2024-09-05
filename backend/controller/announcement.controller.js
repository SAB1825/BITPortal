import User from "../model/user.model.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import Announcement from "../model/anouncement.model.js";

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

export const createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;
        const adminId = req.user.userId;

        const newAnnouncement = new Announcement({
            title,
            description,
            createdBy: adminId
        });

        await newAnnouncement.save();

        // Fetch all user emails
        const users = await User.find().select('email');
        const userEmails = users.map(user => user.email);

        // Send email to all users
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmails,
            subject: `New Announcement: ${title}`,
            text: `${title}\n\n${description}`,
            html: `<h2>${title}</h2><p>${description}</p>`
        });

        res.status(201).json({ message: 'Announcement created and sent to all users', announcement: newAnnouncement });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'An error occurred while creating the announcement' });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 }).populate('createdBy', 'username');
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'An error occurred while fetching announcements' });
    }
};
