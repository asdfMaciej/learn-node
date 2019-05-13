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

class Holidays {
	constructor() {
		/*
		src: [20190513 access]
		https://pl.wikipedia.org/wiki/%C5%9Awi%C4%99ta_pa%C5%84stwowe_w_Polsce
		https://pl.wikipedia.org/wiki/Dni_wolne_od_pracy_w_Polsce
		*/
		this.holidays = [  // [month, day] 1-indexed
			[1, 1],
			[1, 6],
			[3, 1],
			[3, 24],
			[4, 14],
			[5, 1],
			[5, 3],
			[5, 8],
			[7, 12],
			[8, 1],
			[8, 15],
			[8, 31],
			[10, 19],
			[11, 11],
			[12, 25],
			[12, 26]
		];
		let date = new Date();
		this.year = date.getFullYear();
		this.addEaster(this.year);
	}

	isHoliday(month, day) {
		let date = this.getDate(this.year, month, day);
		let weekend = [6, 0]; // saturday & sunday
		if (weekend.includes(date.getDay())) {
			return true;
		}
		let checkedDate = [month, day]; // cannot use .includes, 2d array
		let isHoliday = false;
		for (let holiday of this.holidays) {
			isHoliday = isHoliday || (
				holiday[0] == checkedDate[0]
				&& holiday[1] == checkedDate[1]);
		}
		return isHoliday;
	}

	addEaster(year) {
		this.holidays.push(this.getEasterSunday(year));
		this.holidays.push(this.getEasterMonday(year));
		this.holidays.push(this.getZieloneSwiatki(year));
		this.holidays.push(this.getBozeCialo(year));
	}

	getEasterSunday(year) {
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

	getEasterMonday(year) {
		return this.getDateAfterEaster(year, 1);
	}

	getZieloneSwiatki(year) {
		return this.getDateAfterEaster(year, 49);
	}

	getBozeCialo(year) {
		return this.getDateAfterEaster(year, 60);
	}

	getDateAfterEaster(year, daysAfter) {
		let sundayMonth, sundayDay, mondayMonth, mondayDay;
		[sundayMonth, sundayDay] = this.getEasterSunday(year);
		let monday = this.getDate(year, sundayMonth, sundayDay+daysAfter);

		[mondayMonth, mondayDay] = [monday.getMonth()+1, monday.getDate()]
		return [mondayMonth, mondayDay];
	}

	getDate(year, month, day) {
		return new Date(year, month-1, day);
	}
}
/*
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
*/
let h = new Holidays()
console.log(h.holidays)
console.log(h.isHoliday(4, 21))
console.log(h.isHoliday(4, 22))
console.log(h.isHoliday(4, 23))
console.log(h.isHoliday(4, 24))
console.log(h.isHoliday(4, 25))
console.log(h.isHoliday(4, 26))
console.log(h.isHoliday(4, 27))
console.log(h.isHoliday(4, 28))
console.log(h.isHoliday(4, 29))
app.use(express.static('public'));
app.get('/', (req, res) => generatePdf(req, res));
app.get('/test', (req, res) => res.send('Hello World wear!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));