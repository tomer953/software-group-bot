import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    _id: Number,
    is_bot: Boolean,
    first_name: String,
    username: String,
    language_code: String,
    role: { type: String, default: 'user' },
}, { timestamps: true })

module.exports = mongoose.model('User', schema);