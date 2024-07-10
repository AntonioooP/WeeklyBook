require('dotenv').config()

const app = require('express')()
const mongoose = require('mongoose')
const multer = require('multer')
const bodyParser = require('body-parser')
const cors = require('cors')

const Book = require('./models/book')

app.use(bodyParser.json())
app.use(cors())

 mongoose.connect(process.env.mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.log(error))

const storage = multer.memoryStorage()
const upload = multer({storage})
app.get('/books', async (req, res) => {
	try {
		const books = await Book.find()
		res.json(books.map(x => x._id))
	} catch (error) {
		console.log(error)
		res.status(500).send('Error retrieving books')
	}
})

app.get('/random', async (req, res) => {
	try {
		const randomBook = await Book.aggregate([{$sample: {size: 1}}])
		if (!randomBook || randomBook.length === 0) return res.status(404).send('No books found')
		const jsonData = {
			title: randomBook[0].title,
			date: randomBook[0].date,
			description: randomBook[0].description,
			id: randomBook[0]._id
		}
		res.json(jsonData)
	} catch (error) {
		console.log(error)
		res.status(500).send('Error retrieving random book')
	}
})

app.get('/bookData/:id', async (req, res) => {
	try {
		const book = await Book.findById(req.params.id)
		if (!book) return res.status(404).send('Book not found')

		const jsonData = {
			title: book.title,
			date: book.date,
			description: book.description,
			id: book._id
		}

		res.json(jsonData)
	} catch (error) {
		console.log(error)
		res.status(500).send('Error retrieving book')
	}
})


app.get('/image/:id', async (req, res) => {
	try {
		const book = await Book.findById(req.params.id)
		if (!book) return res.status(404).send('Book not found')

		const imageBuffer = Buffer.from(book.image, 'base64')
		res.set('Content-Type', 'image/png')
		res.send(imageBuffer)
	} catch (error) {
		console.log(error)
		res.status(500).send('Error retrieving book')
	}
})

app.post('/upload', upload.single('file'), async (req, res) => {
	const {title, description, pass} = req.body
	if (!req.file) return res.status(400).send('File upload failed')
	if (!title && !description && !pass) return res.status(400).send('Missing parameters')
	if (pass != process.env.password) return res.status(401).send('Incorrect password')
	
	const imageBuffer = req.file.buffer
	const imageBase64 = imageBuffer.toString('base64') // Convert image to Base64

	const newBook = new Book({
		title,
		date: new Date().toLocaleDateString('es-MX'),
		description,
		image: imageBase64
	})

	try {
		await newBook.save()
		res.status(201).send('Book created successfully')
	} catch (error) {
		console.log(error)
		res.status(500).send('Error saving book')
	}
})

app.listen(4200, () => console.log('Listening on port 4200'))
