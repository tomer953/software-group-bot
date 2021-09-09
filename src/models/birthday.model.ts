import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    gender: { type: String, enum: ['female', 'male'], default: 'male' },
    birthday: String,
}, { timestamps: true })

module.exports = mongoose.model('Birthday', schema);