const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
	console.log(`The server received a request: ${req.url}`);

	// Load HTML file
	fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
		if (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Error loading page');
		} else {
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': '*'
			});
			res.end(data);
		}
	});
}).listen(3000, '0.0.0.0', () => {
	console.log('Server is listening on port 3000');
});
