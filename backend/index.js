require('dotenv').config();

const app = require('express')()
const {connect, default: mongoose} = require('mongoose');

mongoose.connect('mongodb://localhost:27017/books', {
    useNewUrlParser: true
}).then(() => console.log('Connected to database')).catch((err) => console.log(err))


app.get('/books/:id', (req, res) => {
    res.send([])
})

app.post('/book', (req, res) => {
    res.send({})
})

app.listen(4200, () => console.log('Listening on port 4200'))