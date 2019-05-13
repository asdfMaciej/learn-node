const express = require('express')
const app = express()
const port = 3000

employees = require('./database.json')
console.log(employees.employees)

function generatePdf(req, res) {
	console.log('dddddddd')
	res.send('ok')
}

app.use(express.static('public'))
app.get('/', (req, res) => generatePdf(req, res))
app.get('/test', (req, res) => res.send('Hello World wear!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))