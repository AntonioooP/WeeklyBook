const mongoose = require('mongoose')
const schema = new mongoose.Schema({
	title: String,
	description: String,
	date: String,
	image: String // Store image as a Base64 string
})

module.exports = mongoose.model('Book', schema)
