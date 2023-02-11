const mongoose = require('mongoose');

const contactScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }

})
const Contact = mongoose.model('Contact', contactScheme);

module.exports = {
    Contact
}