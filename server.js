import dotenv from "dotenv";
dotenv.config();
import cors from "cors"


import express from "express";
import connectDB from "./config/db.js";
import registerRoutes from "./src/routes/index.js";



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
connectDB();

app.get("/", (req, res) => {
  res.send("EDMS API Running");
});

registerRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
