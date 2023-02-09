const { errorCode, errorHandler, errorHandler2 } = require('../helper/errorHandler');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require("express-jwt")

exports.signup = (req, res) => {
    let { username, name, email, password } = req.body;

    if (!username, !name, !email, !password) {
        return res.status(400).json({
            error: "all field required"
        })
    }
    User.findOne({ $or: [{ "username": username }, { "email": email }] })
        .exec((err, existUser) => {
            // console.log(existUser)
            if (existUser) {
                return res.status(400).json({
                    error: "user already exist"
                })
            }
            const newUser = new User({ username, name, email, password });
            newUser.save((err, user) => {
                if (err) {
                    return err.code === 11000 ?
                        errorCode(res, 400, errorHandler2(err))
                        :
                        errorCode(res, 400, errorHandler(err))
                }
                res.json({ message: "Signup success! Please signin." })
            })
        })
}

exports.signin = (req, res) => {
    let { email, username, password } = req.body;
    if (!username, !email, !password) {
        return res.status(400).json({
            error: "all field required"
        })
    }
    User.findOne({ $or: [{ "username": username }, { "email": email }] })
        .exec((err, user) => {
            if (err || !user) {
                return errorCode(res, 401, `user with that ${email}${username} doesn't match`)
            }
            if (!user.authenticate(password)) {
                return errorCode(res, 401, "${email}${username} and password doesn't match")
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '9d' })
            const { _id, username, name, role } = user;
            return res.json({
                token,
                user: { _id, username, name, role }
            })
        })

}
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ["HS256"]
})
exports.authMiddleware = (req, res, next) => {
    const userId = req.auth._id;
    User.findById({ _id: userId }, ((err, user) => {
        if (err || !user) {
            return errorCode(res, 400, "user not found")
        }
        req.profile = user;
        next()
    }))
}
exports.adminMiddleware = (req, res, next) => {
    const userId = req.auth._id;
    User.findById({ _id: userId },
        ((err, user) => {
            if (err || !user) {
                return errorCode(res, 400, "user not found")
            }
            if (user.role !== 1) {
                return errorCode(res, 401, 'Admin resource. Access denied')
            }
            req.profile = user;
            next()
        }))
}