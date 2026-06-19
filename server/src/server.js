import express from "express";
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { reservationCleanupCron } from "./cron/reservationCleanup.cron.js";

const app = express();

const PORT = process.env.PORT || 8082;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is Running!");
});

//Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", eventRoutes);

//Listening
app.listen(PORT, async () => {
    await connectToDB();
    reservationCleanupCron();
    console.log(`Server is running on port ${PORT}`);
});