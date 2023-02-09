const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        product: {
          type: ObjectId,
            ref: "Product",
        },
        paymentIntent: {},
        orderedBy: {
            type: ObjectId,
            ref: "User"
        }
    },
    {timestamps:true}
);

module.exports = mongoose.model('Order',orderSchema)