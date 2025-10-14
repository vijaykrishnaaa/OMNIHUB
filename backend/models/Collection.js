const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    tags: [String],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        content: { type: Schema.Types.ObjectId, ref: 'Content' },
        note: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Collection', CollectionSchema);