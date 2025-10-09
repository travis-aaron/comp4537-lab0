import { labels } from './lang/en/en.js';

const POST_URL = "https://comp-4537-isa-lab4b-production.up.railway.app/api/definitions"

class Store {


	constructor() {
		this.createDefinitionForm();
	}

	isValidString(str) {
		/* ^ and $ are beginning and end of string
		* [] any character in here
		* \s space
		* * 0 or more
		*/
		return /^[A-Za-z\s]*$/.test(str) && str.length > 0;
	}

	createDefinitionForm() {
		/*
		 * Sets up a form to input definitions.
		 */
		const h1 = document.createElement('h1');
		h1.textContent = labels.createDefinition;

		const wordLabel = document.createElement('label');
		wordLabel.setAttribute('for', 'word');
		wordLabel.textContent = labels.wordLabel;

		const wordInput = document.createElement('input');
		wordInput.type = 'text';
		wordInput.id = 'word';
		wordInput.placeholder = labels.enterWord;

		const defLabel = document.createElement('label');
		defLabel.setAttribute('for', 'definition');
		defLabel.textContent = labels.definitionLabel;

		const defTextarea = document.createElement('textarea');
		defTextarea.id = 'definition';
		defTextarea.placeholder = labels.enterDefinition;

		const button = document.createElement('button');
		button.textContent = labels.buttonLabel;
		button.onclick = () => this.postDefinition();
		const resultDiv = document.createElement('div');
		resultDiv.id = 'result';

		const resultText = document.createElement('h3');
		resultText.id = 'resultText';

		const link = document.createElement('a');
		link.setAttribute('href', './search.html')
		link.textContent = labels.findDefinition;


		const inputDiv = document.createElement('div');
		inputDiv.id = 'inputDiv';

		resultDiv.appendChild(resultText);

		inputDiv.appendChild(h1);
		inputDiv.appendChild(wordLabel);
		inputDiv.appendChild(wordInput);
		inputDiv.appendChild(defLabel);
		inputDiv.appendChild(defTextarea);
		inputDiv.appendChild(button);
		inputDiv.appendChild(resultDiv);
		inputDiv.appendChild(link);

		document.body.appendChild(inputDiv);
	}

	async postDefinition() {

		const resultElement = document.getElementById("resultText");
		const wordInputElement = document.getElementById("word");
		const definitionInputElement = document.getElementById("definition");

		// input values
		const wordValue = wordInputElement.value;
		const definitionValue = definitionInputElement.value;

		// validate strings
		if (!this.isValidString(wordValue) || !this.isValidString(definitionValue)) {
			resultElement.innerText = labels.failure;
		}

		try {
			const response = await fetch(POST_URL, {
				method: "POST",
				mode: 'cors',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					word: wordValue,
					definition: definitionValue,
				})
			});
			if (!response.ok) {
				resultElement.innerText = labels.failure;
				throw new Error(`${labels.responseStatus}${response.status}`);
			}

			resultElement.innerText = labels.success;
		} catch (error) {
			console.error(error.message);
		}
	}
}

new Store();
