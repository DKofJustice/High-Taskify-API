const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }]
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)

module.exports = userModel