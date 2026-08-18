const path = require("path");
const fs = require("fs");
const Bill = require("../models/Bill");

const addBill = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            productName,
            brand,
            category,
            price,
            purchaseDate,
            warrantyMonths,
            storeName,
            notes
        } = req.body;

        if (
            !productName ||
            !category ||
            price === undefined ||
            !purchaseDate
        ) {
            return res.status(400).json({
                message:
                    "Product name, category, price and purchase date are required"
            });
        }

        if (isNaN(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                message: "Price must be a valid positive number"
            });
        }

        const purchase = new Date(purchaseDate);

        if (isNaN(purchase.getTime())) {
            return res.status(400).json({
                message: "Invalid purchase date"
            });
        }

        const months = warrantyMonths
            ? Number(warrantyMonths)
            : 0;

        if (isNaN(months) || months < 0) {
            return res.status(400).json({
                message: "Warranty months must be a valid number"
            });
        }

        let warrantyExpiry = null;

        if (months > 0) {
            warrantyExpiry = new Date(purchase);

            warrantyExpiry.setMonth(
                warrantyExpiry.getMonth() + months
            );
        }

        const bill = await Bill.create({
            user: req.userId,
            productName,
            brand,
            category,
            price: Number(price),
            purchaseDate: purchase,
            warrantyMonths: months,
            warrantyExpiry,
            storeName,
            notes,
            receipt: req.file
                ? {
                    filename: req.file.filename,
                    path: req.file.path,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
                : undefined
        });

        res.status(201).json({
            message: "Bill added successfully",
            bill
        });

    } catch (error) {
        console.error("Add bill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            count: bills.length,
            bills
        });

    } catch (error) {
        console.error("Get bills error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBill = async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        res.status(200).json({
            bill
        });

    } catch (error) {
        console.error("Get bill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateBill = async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        const allowedFields = [
            "productName",
            "brand",
            "category",
            "price",
            "purchaseDate",
            "warrantyMonths",
            "storeName",
            "notes"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                bill[field] = req.body[field];
            }
        });

        if (
            req.body.warrantyMonths !== undefined ||
            req.body.purchaseDate !== undefined
        ) {
            const months = Number(bill.warrantyMonths);

            if (months > 0) {
                const expiry = new Date(bill.purchaseDate);

                expiry.setMonth(
                    expiry.getMonth() + months
                );

                bill.warrantyExpiry = expiry;
            } else {
                bill.warrantyExpiry = null;
            }
        }

        await bill.save();

        res.status(200).json({
            message: "Bill updated successfully",
            bill
        });

    } catch (error) {
        console.error("Update bill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        await bill.deleteOne();

        res.status(200).json({
            message: "Bill deleted successfully"
        });

    } catch (error) {
        console.error("Delete bill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getReceipt = async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        if (!bill.receipt || !bill.receipt.filename) {
            return res.status(404).json({
                message: "Receipt not found"
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            bill.receipt.filename
        );

        console.log("Receipt path:", filePath);
        console.log("File exists:", fs.existsSync(filePath));

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "Receipt file not found"
            });
        }

        res.sendFile(filePath);

    } catch (error) {
        console.error("Get receipt error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill,
    getReceipt
};