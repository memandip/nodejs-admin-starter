const { Schema, model } = require('mongoose')

var MessageSchema = new Schema({
    type: String,
    message: {
        type: String,
        required: true
    },
    date: { type: Date, default: new Date() }
})

var Message = model('Message', MessageSchema)

module.exports = Message;