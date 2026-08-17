const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const billRoutes = require("./routes/billRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BillVault API"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", billRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`BillVault server running on port ${PORT}`);
});
