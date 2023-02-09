const { errorCode, errorHandler, errorHandler2 } = require('../helper/errorHandler');
const Cart = require('../models/cart')
const Product = require('../models/product')
const Order = require('../models/order')

exports.userCart = async (req, res) => {
    const productId = req.body.product
    let user = req.profile;
    let existCartByThisUser = await Cart.findOne({ orderedBy: user._id })

    if (existCartByThisUser) {
        existCartByThisUser.remove()
    }
    let { price } = await Product.findById(productId).select("price").exec()
    let cart = new Cart({
        product: productId,
        orderedBy: user._id,
        cartTotal: price
    })

    cart.save((err, result) => {
        if (err) {
            return errorCode(res, 400, errorHandler(err))
        }
        res.json({ ok: true })
    })

}

exports.createOrder = (req, res) => {
    let user = req.profile;
    const {paymentIntent} = req.body;
    // console.log(req.body)
    Cart.findOne({ orderedBy: user._id })
        .exec((err, cart) => {
            if (err) {
                return errorCode(res, 400, "Order Failed")
            }
            let order = new Order({
                product: cart.product,
                paymentIntent,
                orderedBy: user._id,
            })
            // console.log(order)
             order.save((err, result) => {
                if (err) {
                    return errorCode(res, 400, "Order Failed")
                }
                cart.remove({ _id: cart._id })
                res.json({ ok: true })
            })
        })
}