const mongoose = require('mongoose'),
	schema = new mongoose.Schema({
        title: String,
        description: String,
		date: String,
		imageId: mongoose.Schema.Types.ObjectId // Reference to the image stored in GridFS
	})

module.exports = mongoose.model('book', schema)