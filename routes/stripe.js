const express = require('express');
const router = express.Router();

const { requireSignin, authMiddleware } = require('../controllers/auth');
const { createPaymentIntent } = require("../controllers/stripe")

router.post("/stripe-payment",requireSignin, authMiddleware, createPaymentIntent);

module.exports = router;
