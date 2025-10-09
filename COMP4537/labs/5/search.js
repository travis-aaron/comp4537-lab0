import { labels } from './lang/en/en.js';

const GET_URL = 'https://comp-4537-isa-lab4b-production.up.railway.app/api/definitions/?word='

class Search {

	constructor() {
		this.createSearchForm();
	}

	isValidString(str) {
		/* ^ and $ are beginning and end of string
		* [] any character in here
		* \s space
		* * 0 or more
		*/
		return /^[A-Za-z\s]*$/.test(str) && str.length > 0;
	}

	createSearchForm() {
		/*
		 * Sets up an text input to retrieve definitions
		 */
		const h1 = document.createElement('h1');
		h1.textContent = labels.search;

		let typingTimer;
		const typingDelay = 500;

		const wordInput = document.createElement('input');
		wordInput.type = 'text';
		wordInput.id = 'findWord';
		wordInput.placeholder = labels.findDefinition;

		const wordLabel = document.createElement('label');
		wordLabel.setAttribute('for', 'findWord');
		wordLabel.textContent = labels.wordLabel;

		const definitionDiv = document.createElement('div');
		definitionDiv.id = 'definition';

		const resultDiv = document.createElement('div');
		resultDiv.id = 'result';

		const resultText = document.createElement('h3');
		resultText.id = 'resultText';


		resultDiv.appendChild(resultText);


		// queries for word after 500ms of not typing
		wordInput.addEventListener('input', () => {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(() => {
				this.getDefinition();
			}, typingDelay);
		});

		const link = document.createElement('a');
		link.setAttribute('href', './store.html')
		link.textContent = labels.enterDefinition;

		const inputDiv = document.createElement('div');
		inputDiv.id = 'inputDiv';

		inputDiv.appendChild(h1);
		inputDiv.appendChild(wordLabel);
		inputDiv.appendChild(wordInput);
		inputDiv.appendChild(definitionDiv);
		inputDiv.appendChild(resultDiv);
		inputDiv.appendChild(link);

		document.body.appendChild(inputDiv);
	}

	async getDefinition() {


		const resultElement = document.getElementById('resultText');
		const wordInputElement = document.getElementById('findWord');
		const wordValue = wordInputElement.value;

		if (!this.isValidString(wordValue)) {
			resultElement.innerText = labels.failure;
		}

		const response = await fetch(`${GET_URL}{wordValue}`);
		try {
			const result = await response.json();

			if (response.status !== 200) {
				resultElement.innerText = result.message;
			} else {
				resultElement.innerText = `${result.word}: ${result.definition}`;
			}
		} catch (error) {
			console.error(error.message);
		}

	}
}

new Search();
