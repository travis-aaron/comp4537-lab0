import { IndexLayout, WriterLayout, ReaderLayout } from './layout.js';

class App {
	constructor() {
		this.layout = null;
	}

	async start() {
		if (document.readyState === 'loading') {
			// wait for the document to load - avoids errors / weird behaviour
			await new Promise(resolve => {
				document.addEventListener('DOMContentLoaded', resolve, { once: true });
			});
		}

		// create appropriate layout based on path
		const currentPage = window.location.pathname;

		if (currentPage.includes('writer.html')) {
			this.layout = new WriterLayout();
		} else if (currentPage.includes('reader.html')) {
			this.layout = new ReaderLayout();
		} else {
			this.layout = new IndexLayout();
		}
	}
}

const app = new App();
app.start();
