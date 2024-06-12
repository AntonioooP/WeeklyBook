require('dotenv').config()

const app = require('express')()
const mongoose = require('mongoose')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const mongoURI = process.env.mongo

const Book = require('./models/book')

app.use(bodyParser.json())
app.use(methodOverride('_method'))

const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
conn.on('error', console.error.bind(console, 'MongoDB connection error:'))

let gfs
conn.once('open', () => {
	gfs = Grid(conn.db, mongo)
	gfs.collection('uploads')
    console.log('GridFS connection established')
})

const storage = new GridFsStorage({
	db: conn,
	options: {useNewUrlParser: true, useUnifiedTopology: true},
    file: (req, file) => {
        console.log('uploading file ', file)
		return {
			filename: file.originalname,
			bucketName: 'uploads'
		}
	}
})
const upload = multer({storage})

app.get('/books/:id', (req, res) => {
    gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, file) => {
        if (err) return res.status(500).send(err)
		if (!file || file.length === 0) return res.status(404).send('No file exists')
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			// Read output to browser (temporary)
			const readstream = gfs.createReadStream(file.filename)
			readstream.pipe(res)
		} else res.status(404).send('Not an image')
	})
})

app.post('/upload', upload.single('file'), async (req, res) => {
	const {title, date, description} = req.body
    console.log('body,', req.body)
    console.log('Uploaded file:', req.file)
    if (!req.file) return res.status(400).send('File upload failed')
	const newBook = new Book({
		title,
        date,
        description,
		imageId: req.file.id
    })
    console.log(newBook)

	try {
		await newBook.save()
		res.status(201).send('Book created successfully')
	} catch (error) {
		console.log(error)
		res.status(500).send('Error saving book')
	}
})

app.listen(4200, () => console.log('Listening on port 4200'))
