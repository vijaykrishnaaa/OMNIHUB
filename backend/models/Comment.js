const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { 
        type: String, 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    review: { 
        type: Schema.Types.ObjectId, 
        ref: 'Review', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);