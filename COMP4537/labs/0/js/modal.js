import { modalDialogText, buttonLabels, errorLabels } from '../lang/messages/en/user.js';

export class Modal {
	dialog;
	form;
	textElements;
	#inputValue;
	type;
	#buttons;

	constructor(type, gameInstance, buttons = null) {
		this.dialog = document.createElement("dialog");
		this.type = type;
		this.gameInstance = gameInstance;
		this.#buttons = buttons;

		const formText = this.createFormText(type);
		const textContainer = this.populateModalText(formText);
		this.form = this.createForm(type);
		this.dialog.appendChild(textContainer);

		// Game Over extra container/logic to show solution
		if (type === "gameOver" && this.#buttons) {
			this.createSolutionContainer();
		}

		this.dialog.appendChild(this.form);
		document.body.appendChild(this.dialog);
	}

	// animation for revealing solution
	animateSequence() {
		const revealDelay = 500;
		const buttons = document.querySelectorAll("#correct-sequence .button");

		buttons.forEach((button, index) => {
			setTimeout(() => {
				button.style.opacity = "1";
			}, index * revealDelay);
		});
	}

	// creates the interactive modal elements
	createForm(type) {
		if (type === "newGame") {
			let form = document.createElement("form");
			let textInput = document.createElement("input");
			textInput.type = "text";
			textInput.id = "numEntry";

			let submitButton = this.createSubmitButton("startGame", buttonLabels.submitButtonText);
			form.appendChild(textInput);
			form.appendChild(submitButton);
			return form;
		} else { // win + gameOver
			let submitButton = this.createSubmitButton("playAgain", buttonLabels.newGameText);
			this.newGameEventListener(submitButton);

			return submitButton;
		}
	}

	createFormText(type) {
		if (type === "newGame") {
			this.dialog.id = "newGame";
			return {
				heading: modalDialogText.newGameHeading,
				comment: modalDialogText.newGameComment,
			}
		} else if (type === "win") {
			this.dialog.id = "win";
			return {
				heading: modalDialogText.winHeading,
				comment: modalDialogText.winComment,
			}
		} else {
			this.dialog.id = "gameOver";
			return {
				heading: modalDialogText.gameOverHeading,
				comment: modalDialogText.gameOverComment,
			}
		}
	}

	// DOM container that holds correct solution
	createSolutionContainer() {
		const buttonContainer = document.createElement("div");
		let solutionLabel = document.createElement("p");
		solutionLabel.innerHTML = modalDialogText.correctSolutionLabel;
		buttonContainer.id = "correct-sequence";

		this.dialog.appendChild(solutionLabel);
		this.dialog.appendChild(buttonContainer);

	}

	createSubmitButton(id, textContent) {
		let submitButton = document.createElement("button");
		submitButton.id = id;
		submitButton.value = "Submit";
		submitButton.textContent = textContent;
		return submitButton;
	}

	// Go button event listener
	getInput() {
		return new Promise((resolve) => {
			let submitButton = document.getElementById("startGame");
			let textInput = document.getElementById("numEntry");

			submitButton.addEventListener('click', (event) => {
				event.preventDefault();

				if (this.validateInput(textInput.value)) {
					this.#inputValue = textInput.value;
					this.dialog.close();
					resolve(this.#inputValue);
				}
			});
		})
	}

	// attaches a listener to a button to start a new game
	newGameEventListener(button) {
		button.addEventListener('click', (event) => {
			event.preventDefault();
			this.dialog.close();
			this.gameInstance.run();
		});
	}

	// add buttons for correct solution to DOM
	populateCorrectSequence() {
		const container = document.getElementById("correct-sequence");
		if (!container || !this.#buttons) return;

		this.#buttons.forEach((originalButton) => {
			const buttonCopy = document.createElement("button");
			buttonCopy.className = "button";
			buttonCopy.style.backgroundColor = originalButton.backgroundColour;
			buttonCopy.textContent = originalButton.order;
			buttonCopy.style.opacity = "0";
			buttonCopy.disabled = true;

			container.appendChild(buttonCopy);
		});
	}

	// creates text elements on modal
	populateModalText(formText) {
		let textContainer = document.createElement("div");
		textContainer.id = "formText";

		let heading = document.createElement("h2");
		heading.innerHTML = formText.heading;

		let comment = document.createElement("p");
		comment.innerHTML = formText.comment;

		let error = document.createElement("p");
		error.id = "error";

		textContainer.appendChild(heading);
		textContainer.appendChild(comment);
		textContainer.appendChild(error);

		return textContainer;
	}

	// returns true if input is in int in range [3, 7] else false
	validateInput(newValue) {
		const invalidValue = errorLabels.invalidValue;

		// use query selector or this might return an old instance
		let errorText = this.dialog.querySelector("#error");
		const validatedInput = Number.parseInt(newValue);

		// Number.parse returns NaN for all invalid types
		if (isNaN(validatedInput)) {
			errorText.innerHTML = invalidValue;
			return false;
		} else if (validatedInput < 3 || validatedInput > 7) {
			errorText.innerHTML = invalidValue;
			return false;
		}
		errorText.innerHTML = ""; // resets previous errors
		this.#inputValue = validatedInput;
		return true;
	}
}
