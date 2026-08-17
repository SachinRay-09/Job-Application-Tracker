import express from "express";
import session from "express-session";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();

const Port = process.env.PORT;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/jobapptracker", router);

app.listen(Port, () => console.log("Server is running on Port:", Port));

connectDB();
