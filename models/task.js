const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: String,
    notes: String,
    date: Date,
    time: String,
    flag: Boolean,
    isCompleted: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

const taskModel = mongoose.model("task", taskSchema)

module.exports = taskModel