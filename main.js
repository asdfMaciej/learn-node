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
			[5, 1],
			[5, 3],
			[8, 15],
			[11, 1],
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

class Calendar {
	constructor() {
		this.holidays = new Holidays();
		let date = new Date();
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
	}

	getMonth() {
		let daysList = [];
		let daysAmount = this.daysInMonth(this.year, this.month);
		for (let day = 1; day <= daysAmount; day++) {
			let dayObject = {
				day: day,
				month: this.month,
				year: this.year,
				isHoliday: this.holidays.isHoliday(this.month, day)
			};
			daysList.push(dayObject);
		}

		return daysList;
	}

	daysInMonth(year, month) {
		// month is 0-indexed, so it returns 0th day of the next month, 
		// hence last day of specified month alas the amount of them
		return new Date(year, month, 0).getDate();
	}
}

class MonthTable {
	constructor() {
		let calendar = new Calendar();
		this.month = calendar.getMonth();
	}

	generate() {
		let tableWidths = ['auto', '*', '*', '*', '*', '*']
		let tableHeaders = [
			'Dzień', 'Godzina rozpoczęcia', 'Godzina zakończenia',
			'Razem godzin', 'Podpis', 'Uwagi'
		];
		let tableBody = [tableHeaders];


		for (let day of this.month) {
			let emptyCell = {text: ''};
			let dayRow = [
				{text: day.day}, 
				emptyCell, emptyCell, emptyCell, emptyCell, emptyCell
			];

			if (day.isHoliday) {
				for (let i in dayRow) {
					dayRow[i].style = 'holiday';
				}
			}
			tableBody.push(dayRow);
		}

		let table = {
			layout: '',
			table: {
				headerRows: 1,
				widths: tableWidths,
				body: tableBody
			}
		};
		return [table];
	}
}

class Header {
	constructor(firstName, lastName) {
		let date = new Date();
		let months = [
			"Styczeń", "Luty", "Marzec", "Kwiecień", 
			"Maj", "Czerwiec", "Lipiec", "Sierpień", 
			"Wrzesień", "Październik", "Listopad", "Grudzień"
		];
		this.firstName = firstName;
		this.lastName = lastName;
		this.year = date.getFullYear();
		this.yearSuffix = this.year.toString().slice(-2); // 2018 -> 18
		this.month = months[date.getMonth()].toLowerCase();
	}

	generate() {
		let textTop = {
			text: 'LISTA OBECNOŚCI',
			style: 'header'
		};
		let information = {
			columns: [
				//{width: '*', text: `Imię: ${this.firstName}`},
				//{width: '*', text: `Nazwisko: ${this.lastName}`},
				{width: '*', style: 'name', text: `${this.firstName} ${this.lastName}`},
				{width: '*', style: 'year', text: `${this.month} ’${this.yearSuffix}`}
			],
			style: 'information'
		};
		return [textTop, information];
	}
}

class PdfGenerator {
	constructor(response) {
		let PdfPrinter = require('pdfmake');
		let fonts = {
			Roboto: {
				normal: 'fonts/Roboto-Regular.ttf',
				bold: 'fonts/Roboto-Medium.ttf',
				italics: 'fonts/Roboto-Italic.ttf',
				bolditalics: 'fonts/Roboto-MediumItalic.ttf'
			}
		};
		this.response = response;
		this.printer = new PdfPrinter(fonts);
		this.filename = 'lista-obecnosci.pdf';
		this.styles = {
			holiday: {
				fillColor: '#D2D2D2'
			},

			header: {
				fontSize: 22,
				alignment: 'center',
				margin: 8
			},

			name: {
				alignment: 'left',
				bold: true,
				fontSize: 12
			},

			year: {
				fontSize: 16,
				alignment: 'right'
			},

			information: {
				margin: [1, 8, 1, 4]
			}
		}
		this.document = {
			content: [],
			styles: this.styles
		};
	}

	generateEmployees(employees) {
		let table = new MonthTable().generate();
		let header = new Header("Maciej", "Kaszkowiak").generate();

		let document = [header, table];
		this.document.content.push(document);
	}

	outputHeaders() {
		let filename = this.filename;
		this.response.setHeader('Content-disposition', `inline; filename="${filename}"`);
		this.response.setHeader('Content-type', 'application/pdf');
	}
	output() {
		this.outputHeaders();
		let pdf = this.printer.createPdfKitDocument(this.document);
		let chunks = [];
		let result;

		pdf.on('data', chunk => {
			chunks.push(chunk);
		});
		pdf.on('end', () => {
			result = Buffer.concat(chunks);
			this.response.send(result);
		});
		pdf.end();
	}
}

const express = require('express');

const app = express();
const port = 3000;


function generatePdf(req, res) {	
	console.log('dddddddd');
	
	let employees = require('./database.json');
	let employeesList = employees.employees;

	let gen = new PdfGenerator(res);
	gen.generateEmployees(employeesList);
	gen.output();
}


app.use(express.static('public'));
app.get('/', (req, res) => generatePdf(req, res));
app.get('/test', (req, res) => res.send('Hello World wear!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));