const http = require('http');
const url = require('url');
const fs = require('fs');
const local = require('./lang/en/en.js');
const path = require('path');

class App {
	#port;
	#serverMessage;
	#hostname;
	#fileName;
	#filePath;

	constructor(port, hostname) {
		this.#port = port;
		this.#hostname = hostname;
		this.#fileName = 'file.txt';
		this.#filePath = path.join(__dirname, this.#fileName);
		this.#serverMessage = local.serverListening.replace('%1', port);
	}

	handleFileOperations(req, res) {
		const parsedUrl = url.parse(req.url, true);
		const pathname = parsedUrl.pathname;
		const query = parsedUrl.query;

		// write to file
		if (pathname === '/writeFile/' && query.text) {
			const textToAppend = query.text + '\n';
			fs.appendFileSync(this.#filePath, textToAppend, 'utf8');
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end();

			// read from file
		} else if (pathname.startsWith('/readFile/')) {
			const fileName = pathname.split('/readFile/')[1];
			const filePath = path.join(__dirname, fileName);
			try {
				const fileContent = fs.readFileSync(filePath, 'utf8');
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end(fileContent);
			} catch (error) {
				if (error.code === 'ENOENT') {
					res.writeHead(404, { 'Content-Type': 'text/plain' });
					const responseString = local.fileError.replace('%1', fileName);
					res.end(responseString);
				}
			}
		}
	}

	run() {
		const server = http.createServer((req, res) => {
			this.handleFileOperations(req, res);
		});

		server.listen(this.#port, this.#hostname, () => {
			console.log(this.#serverMessage);
		});
	}
}

const app = new App(3000, 'localhost');
app.run();
