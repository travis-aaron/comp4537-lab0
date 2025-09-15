const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/comp4537/labs/0/*', (req, res) => {
	const filePath = req.path.replace('/comp4537/', '/COMP4537/');
	res.sendFile(path.join(__dirname, filePath));
});

app.get('/comp4537/labs/0', (req, res) => {
	res.sendFile(path.join(__dirname, 'COMP4537/labs/0/index.html'));
});

app.get('/comp4537/labs/1', (req, res) => {
	res.sendFile(path.join(__dirname, 'COMP4537/labs/1/index.html'));
});

app.get('/', (req, res) => {
	res.redirect('/comp4537/labs/1/');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
