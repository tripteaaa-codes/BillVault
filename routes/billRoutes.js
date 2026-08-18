const express = require("express");

const {
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill,
    getReceipt
} = require("../controllers/billController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("receipt"),
    addBill
);

router.get("/", protect, getBills);

router.get("/:id", protect, getBill);

router.get("/:id/receipt", protect, getReceipt);

router.put("/:id", protect, updateBill);

router.delete("/:id", protect, deleteBill);

module.exports = router;