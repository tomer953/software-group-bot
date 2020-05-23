import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    birthday: Date,
}, { timestamps: true })

module.exports = mongoose.model('Birthday', schema);