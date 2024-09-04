import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { verifyToken } from './middleware/middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Apply verifyToken middleware to all routes under /api/auth except signin and register
app.use("/api/auth", (req, res, next) => {
    if (req.path === '/signin' || req.path === '/register') {
        next();
    } else {
        verifyToken(req, res, next);
    }
});

app.use("/api/auth", userRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT)

})
