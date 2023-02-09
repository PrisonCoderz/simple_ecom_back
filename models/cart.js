const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
    {
        product: {
            type: ObjectId,
            ref: "Product",
        },
        cartTotal: Number,
        orderedBy: {
            type: ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema)