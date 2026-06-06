import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import registerRoutes from "./src/routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("EDMS djhfefg erg erg erge rtAPI Running");
});

registerRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
