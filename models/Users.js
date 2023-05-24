const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
    username: { type: 'String', required: true },
    email: { type: 'String', required: true },
    password: { type: 'String', required: true },
    // admin: { type: 'Boolean', default: false }
})
module.exports = mongoose.model('Users',usersSchema);