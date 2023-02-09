const Product = require('../models/product');
const formidable = require('formidable')
const slugify = require('slugify')
const { errorHandler2, errorHandler, errorCode } = require('../helper/errorHandler')
const _ = require('lodash')

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return errorCode(res, 400, "all fields required")
        }
        const { title, price, image } = fields;
        const slug = slugify(title);

        let product = new Product({ ...fields });
        product.price = Number(price);
        product.slug = slug;

        product.save((err, data) => {
            if (err) {
                return err.code === 11000 ?
                    errorCode(res, 400, errorHandler2(err))
                    :
                    errorCode(res, 400, errorHandler(err))
            }
            res.json({ message: "product added successfully" })
        })
    })
}

exports.list = (req, res) => {
    Product.find()
        .exec((err, product) => {
            if (err) {
                return errorCode(res, 400, "something wrong")
            }
            res.json(product)
        })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Product.findOne({ slug })
        .exec((err, product) => {
            if (err) {
                return errorCode(res, 400, "Something wrong in backend, delete Product error")
            }
            res.json(product)
        })
}

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Product.findOne({ slug })
        .exec((err, product) => {
            if (err) {
                return errorCode(res, 400, "Something wrong in backend, delete Product error")
            }
            let form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return errorCode(res, 400, "form update error")
                }
                const { title, price, image } = fields;
                
                product = _.extend(product, fields)
                if (price) {
                    product.price = Number(price);
                }
                product.save((err, data) => {
                    if (err) {
                        return err.code === 11000 ?
                            errorCode(res, 400, errorHandler2(err))
                            :
                            errorCode(res, 400, errorHandler(err))
                    }
                    res.json({ message: "product update successfully" })
                })

            })
        })
}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Product.deleteOne({ slug })
        .exec((err) => {
            if (err) {
                return errorCode(res, 400, "Something wrong in backend, delete Product error")
            }
            res.json({
                message: "Product deleted successfully"
            })
        })
}

