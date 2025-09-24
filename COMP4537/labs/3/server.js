const http = require('http');
const date = require('./modules/util');
const local = require('./lang/en/en.js');
const url = require('url');

class App {
	#port;
	#serverMessage;
	#hostname;

	constructor(port, hostname) {
		this.#port = port;
		this.#hostname = hostname;
		this.#serverMessage = local.serverListening.replace('%1', port);
	}

	run() {
		const server = http.createServer((req, res) => {
			const parsedUrl = url.parse(req.url, true);
			const query = parsedUrl.query;

			const dateObj = new date.CurrentDate();
			const currentTime = dateObj.getCurrentDate();

			if (query.name) {
				let dateString = local.dateResponse;
				dateString = dateString
					.replace('%1', query.name) + ' ' + currentTime;

				dateString = `<span style="color: blue;">${dateString}</span>`;

				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(dateString);
			}
		});

		server.listen(this.#port, this.#hostname, () => {
			console.log(this.#serverMessage);
		});

	}
}

const app = new App(3000, 'localhost');
app.run();
