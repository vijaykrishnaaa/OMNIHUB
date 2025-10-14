const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EditSuggestionSchema = new Schema({
    suggestionType: { type: String, required: true },
    problematicSection: { type: String },
    suggestionText: { type: String, required: true },
    sourceLink: { type: String },
    suggestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    writeUp: { type: Schema.Types.ObjectId, ref: 'WriteUp', required: true },
}, { timestamps: true });

module.exports = mongoose.model('EditSuggestion', EditSuggestionSchema);