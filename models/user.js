const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'username is required'],
            max: [32, "user name should be less than 32"],
            unique: [true, 'username already taken'],
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'name is required'],
            maxlength: [32, "name should be less than 32"],
        },
        email: {
            type: String,
            trim: true,
            required: [true, "email is required"],
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("email is invalid")
                }
            }
        },
        hashed_password: {
            type: String,
            required: [true, 'password is required']
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        resetPasswordLink: {
            data: String,
            default: ""
        },
    },
    { timestamps: true }
);

userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText)
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return "error in encrypting password"
        }
    }
}
// userSchema.virtual("fullname")
//     .set(function (v) {
//         this._name = v;
//         this.name=v
//     })
//     .get(function () {
//         return this._name
//     })
//let fullname = "abc"
//now attribute name = "abc"

module.exports = mongoose.model("User", userSchema)