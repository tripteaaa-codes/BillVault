const Bill = require("../models/Bill");


// ADD BILL
const addBill = async (req, res) => {
    try {
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
                message: "Product name, category, price and purchase date are required"
            });
        }

        let warrantyExpiry = null;

        if (warrantyMonths && Number(warrantyMonths) > 0) {
            warrantyExpiry = new Date(purchaseDate);

            warrantyExpiry.setMonth(
                warrantyExpiry.getMonth() + Number(warrantyMonths)
            );
        }

        const bill = await Bill.create({
            user: req.userId,
            productName,
            brand,
            category,
            price,
            purchaseDate,
            warrantyMonths: warrantyMonths || 0,
            warrantyExpiry,
            storeName,
            notes
        });

        res.status(201).json({
            message: "Bill added successfully",
            bill
        });

    } catch (error) {
        console.error("Add bill error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL USER BILLS
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
            message: "Server error"
        });
    }
};


// GET SINGLE BILL
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
            message: "Server error"
        });
    }
};


// UPDATE BILL
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
            message: "Server error"
        });
    }
};


// DELETE BILL
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
            message: "Server error"
        });
    }
};


module.exports = {
    addBill,
    getBills,
    getBill,
    updateBill,
    deleteBill
};