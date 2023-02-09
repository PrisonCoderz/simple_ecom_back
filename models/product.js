const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            minlength: [3, "title is too small"],
            maxlength: [160, "title is too large"],
            required: [true, 'title missing']
        },
        slug: {
            type: String,
            unique: [true, "dublicate error"],
            index: true,
            lowercase: true,
            required: true
        },
        price: {
            type: Number,
            required: [true, "price missing"],
            maxlength: [8, "price length is too large"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "image missing"]
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Product',productSchema)