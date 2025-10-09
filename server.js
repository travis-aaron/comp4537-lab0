const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');

const date = require('./COMP4537/labs/3/modules/util');
const local = require('./COMP4537/labs/3/lang/en/en.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.', {
	setHeaders: (res, path) => {
		if (path.endsWith('.css')) {
			res.setHeader('Content-Type', 'text/css');
		} else if (path.endsWith('.js')) {
			res.setHeader('Content-Type', 'application/javascript');
		}
	}
}));

app.get('/comp4537/labs/3/getDate', (req, res) => {
	const query = req.query;
	const dateObj = new date.CurrentDate();
	const currentTime = dateObj.getCurrentDate();

	if (query.name) {
		let dateString = local.dateResponse;
		dateString = dateString.replace('%1', query.name) + ' ' + currentTime;
		dateString = `<span style="color: blue;">${dateString}</span>`;

		res.setHeader('Content-Type', 'text/html');
		res.send(dateString);
	} else {
		res.status(400).send('Name parameter required');
	}
});

app.get('/comp4537/labs/3/writeFile/', (req, res) => {
	const query = req.query;

	if (query.text) {
		const fileName = 'file.txt';
		const filePath = path.join(__dirname, 'COMP4537/labs/3', fileName);
		const textToAppend = query.text + '\n';

		try {
			fs.appendFileSync(filePath, textToAppend, 'utf8');
			res.setHeader('Content-Type', 'text/plain');
			res.send();
		} catch (error) {
			res.status(500).send('Error writing file');
		}
	} else {
		res.status(400).send('Text parameter required');
	}
});

app.get('/comp4537/labs/3/readFile/:filename', (req, res) => {
	const fileName = req.params.filename;
	const filePath = path.join(__dirname, 'COMP4537/labs/3', fileName);

	try {
		const fileContent = fs.readFileSync(filePath, 'utf8');
		res.setHeader('Content-Type', 'text/plain');
		res.send(fileContent);
	} catch (error) {
		if (error.code === 'ENOENT') {
			const responseString = local.fileError.replace('%1', fileName);
			res.status(404).send(responseString);
		} else {
			res.status(500).send('Error reading file');
		}
	}
});

app.get('/comp4537/labs/0/*', (req, res) => {
	const filePath = req.path.replace('/comp4537/', '/COMP4537/');
	res.sendFile(path.join(__dirname, filePath));
});

app.get('/comp4537/labs/0', (req, res) => {
	res.redirect('/comp4537/labs/0/');
});

app.get('/comp4537/labs/0/', (req, res) => {
	res.sendFile(path.join(__dirname, 'COMP4537/labs/0/index.html'));
});

app.get('/comp4537/labs/1/*', (req, res) => {
	const filePath = req.path.replace('/comp4537/', '/COMP4537/');
	res.sendFile(path.join(__dirname, filePath));
});

app.get('/comp4537/labs/1', (req, res) => {
	res.redirect('/comp4537/labs/1/');
});

app.get('/comp4537/labs/1/', (req, res) => {
	res.sendFile(path.join(__dirname, 'COMP4537/labs/1/index.html'));
});

app.get('/comp4537/labs/3/*', (req, res) => {
	const filePath = req.path.replace('/comp4537/', '/COMP4537/');
	res.sendFile(path.join(__dirname, filePath));
});

app.get('/comp4537/labs/5/*', (req, res) => {
	const filePath = req.path.replace('/comp4537/', '/COMP4537/');
	res.sendFile(path.join(__dirname, filePath));
});


app.get('/', (req, res) => {
	res.redirect('/comp4537/labs/5/');
});

app.use((req, res) => {
	res.status(404).send('Page not found');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(`Access your app at: http://localhost:${port}`);
});
