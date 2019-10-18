const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { Schema, model } = require('mongoose')
const { secret } = require('../config/constants')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        default: 'user'
    },
    lastActiveTime: { type: Date, default: new Date() },
    hash: String,
    salt: String
})

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 7)
    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, secret)
}

UserSchema.methods.toAuthJSON = function(){
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        type:'a',
        token: this.generateJWT()
    }
}

const User = model('User', UserSchema)

module.exports = User

