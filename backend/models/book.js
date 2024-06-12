const mongoose = require('mongoose'),
    schema = new mongoose.Schema({
        title: String,
        date: String,
        image: String
    })

module.exports = mongoose.model('book', schema)