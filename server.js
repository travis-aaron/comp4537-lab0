const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files with proper MIME types
app.use(express.static('.', {
	setHeaders: (res, path) => {
		if (path.endsWith('.css')) {
			res.setHeader('Content-Type', 'text/css');
		} else if (path.endsWith('.js')) {
			res.setHeader('Content-Type', 'application/javascript');
		}
	}
}));

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

app.get('/', (req, res) => {
	res.redirect('/comp4537/labs/1/');
});

app.use((req, res) => {
	res.status(404).send('Page not found');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(`Access your app at: http://localhost:${port}`);
});
