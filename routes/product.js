const express = require('express');
const router = express.Router();

const { create, list, read, update, remove } = require("../controllers/product")
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post("/product", requireSignin, adminMiddleware, create);
router.get("/products", list);
router.get("/product/:slug", read);
router.put("/product/:slug", requireSignin, adminMiddleware, update);
router.delete('/product/:slug', requireSignin, adminMiddleware, remove)

module.exports = router