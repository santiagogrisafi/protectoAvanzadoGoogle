const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'Se requiere del campo'],
        default: '',
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere del campo'],
        ref: 'User',
    }
});

module.exports = mongoose.model('Category', categorySchema);