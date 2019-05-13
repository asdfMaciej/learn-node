const express = require('express');

const app = express();
const port = 3000;
var PdfPrinter = require('pdfmake');

employees = require('./database.json');
console.log(employees.employees);

function generatePdf(req, res) {
	console.log('dddddddd');
	res.send('ok');
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.isSameDay = function(d2) {
	let d1 = this;
	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}

function getEaster(year) {
	// source = https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
	var f = Math.floor,
		G = year % 19,
		C = f(year / 100),
		H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
		I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
		J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
		L = I - J,
		month = 3 + f((L + 40)/44),
		day = L + 28 - 31 * f(month / 4);

	return [month,day];
}


let easterMonth, easterDay; 
[easterMonth, easterDay] = getEaster(2019);

let date = new Date();
let currentYear = date.getFullYear();
let months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
let month = months[date.getMonth()]
let day = date.getDay()
console.log(month)
console.log(day)
var theBigDay = new Date;
theBigDay.setMonth(easterMonth - 1);
theBigDay.setDate(easterDay);
theBigDay.setYear(currentYear);
console.log(theBigDay);

app.use(express.static('public'));
app.get('/', (req, res) => generatePdf(req, res));
app.get('/test', (req, res) => res.send('Hello World wear!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));