const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BillVault API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`BillVault server running on port ${PORT}`);
});
