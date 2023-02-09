const Cart = require('../models/cart')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    const user = req.profile;
    const { cartTotal } = await Cart.findOne({ orderedBy: user._id }).exec()
    // console.log(cartTotal)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal*100,
        currency: "usd"
    });
    // console.log(paymentIntent)
    res.send({
        clientSecret: paymentIntent.client_secret
    })
}