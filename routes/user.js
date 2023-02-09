const express = require('express');
const router = express.Router();

const { requireSignin, authMiddleware } = require("../controllers/auth")
const { userCart,createOrder } = require("../controllers/user")

router.post('/cart/userCart', requireSignin, authMiddleware, userCart)
router.post('/order/userOrder', requireSignin, authMiddleware, createOrder)

module.exports = router;