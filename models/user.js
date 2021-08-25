const mongoose = require('mongoose');
const mongooseUnique = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let roles = {
    values: ['admin', 'user'],
    message: '{VALUE} tiene que ser admin o user',
};

let userSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: [true, 'Se requiere del campo'],
    },
    email: {
        type: String,
        default: '',
        required: [true, 'Se requiere del campo'],
        unique: true,
    },
    password: {
        type: String,
        default: '',
        required: [true, 'Se requiere del campo'],
    },
    role: {
        type: String,
        default: 'user',
        required: [false],
        enum: roles,
    },
    img: {
        type: String,
        default: '',
        required: [false],
    },
    status: {
        type: Boolean,
        default: false,
        required: [false],
    },
    google: {
        type: Boolean,
        default: false,
        required: [false],
    },
});

userSchema.methods.JSON = () => {
    let catchUser = this;
    let userObject = catchUser.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.plugin(mongooseUnique, { message: '{PATH} tiene que ser unico' });

module.exports = mongoose.model('User', userSchema);