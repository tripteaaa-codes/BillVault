const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productName: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        purchaseDate: {
            type: Date,
            required: true
        },

        warrantyMonths: {
            type: Number,
            default: 0,
            min: 0
        },

        warrantyExpiry: {
            type: Date
        },

        storeName: {
            type: String,
            trim: true
        },

        notes: {
            type: String,
            trim: true
        },

        receipt: {
            filename: {
                type: String
            },

            path: {
                type: String
            },

            mimetype: {
                type: String
            },

            size: {
                type: Number
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Bill", billSchema);