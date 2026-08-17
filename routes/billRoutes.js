const express = require("express");

const {
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill
} = require("../controllers/billController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addBill);

router.get("/", protect, getBills);

router.get("/:id", protect, getBill);

router.put("/:id", protect, updateBill);

router.delete("/:id", protect, deleteBill);

module.exports = router;