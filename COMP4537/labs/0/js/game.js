import { Modal } from './modal.js';
import { GameButton } from './gameButton.js';

export class Game {
	#buttonCount;
	#buttons = [];
	#viewport;
	#guess;
	buttonColours = [];

	constructor() {
		//create the playable game area and add to the DOM
		this.#viewport = document.createElement("div");
		this.#viewport.id = "viewport";
		document.body.appendChild(this.#viewport);
	}

	// game loop
	async run() {
		const secondInMilliseconds = 1000;
		const scrambleDelay = 2000;
		const delayWithAnimationOffset = 1500;

		const newGameModal = new Modal("newGame", this);
		newGameModal.dialog.showModal();

		// wait for user input
		this.#buttonCount = Number(await newGameModal.getInput());

		this.resetGameState();
		this.createGameButtons();

		// delay intervals requiring buttonCount
		const pauseInterval = this.#buttonCount * secondInMilliseconds;
		const labelHideDelay = pauseInterval + (scrambleDelay * this.#buttonCount - delayWithAnimationOffset);

		// scramble buttons after buttonCount seconds
		setTimeout(() => this.scrambleButtons(), pauseInterval);

		this.hideButtonLabels(labelHideDelay);
	}

	createGameButtons() {
		for (let i = 0; i < this.#buttonCount; i++) {
			const buttonColour = this.randomizeBackgroundColour();

			// args: colour, text, order
			const currentButton = new GameButton(buttonColour, `${i + 1}`, i + 1);
			this.#buttons.push(currentButton);
			this.#viewport.appendChild(currentButton.domBtn);

			// store button location for when flexbox is disabled
			const buttonSize = currentButton.domBtn.getBoundingClientRect();
			currentButton.size = {
				width: buttonSize.width,
				height: buttonSize.height,
			}
			this.setButtonGuessEventListener(currentButton);
		}
	}

	getBrowserDimensions() {
		const root = document.documentElement;
		return {
			maxWidth: root.clientWidth,
			maxHeight: root.clientHeight,
		}
	}

	hideButtonLabels(labelHideDelay) {
		setTimeout(() => {
			for (let button of this.#buttons) {
				button.domBtn.textContent = "";
				button.domBtn.disabled = false;
			}
		}, labelHideDelay);

	}

	populateColours() {
		this.buttonColours = [
			"#007BFF", // blue
			"#28A745", // green
			"#FFC107", // yellow
			"#FD7E14", // orange
			"#DC3545", // red
			"#6F42C1", // purple
			"#E83E8C", // pink
		];
	}

	randomizeBackgroundColour() {
		const randomIndex = (max) => Math.floor(Math.random() * max);

		// grab a random colour and its index
		const colour = this.buttonColours[randomIndex(this.buttonColours.length - 1)];
		const index = this.buttonColours.indexOf(colour);

		if (index > -1) { // prevents duplicate colours
			this.buttonColours.splice(index, 1);
		}

		return colour;
	}

	// returns a GameButton with randomized xPos, yPos values
	randomizeButtonPosition(buttonAxes, buttonSize) {
		const browserDimensions = this.getBrowserDimensions();
		const maxWidth = browserDimensions.maxWidth - buttonSize.width;
		const maxHeight = browserDimensions.maxHeight - buttonSize.height;

		const randomPosition = (max) => Math.floor(Math.random() * max);

		// set max x/y position based on browser max dimension for that axis
		const transformPosition = (axis) => axis === "xPos" ? randomPosition(maxWidth)
			: randomPosition(maxHeight);

		return Object.fromEntries(
			buttonAxes.map(axis => [
				axis, transformPosition(axis)
			])
		);
	}

	resetGameState() {
		this.#guess = 0;

		// remove hidden modals from the dom
		const existingNewGameModal = document.getElementById("newGame");
		if (existingNewGameModal) {
			existingNewGameModal.remove();
		}
		const existingGameOverModal = document.getElementById("gameOver");
		if (existingGameOverModal) {
			existingGameOverModal.remove();
		}

		// remove buttons from DOM
		if (this.#buttons.length > 0) {
			const viewportButtons = document.querySelectorAll("#viewport button");
			for (let button of viewportButtons) {
				button.remove();
			}
			this.#buttons = []; // clear buttons array
		}

		// repopulate colour array - only if this is not the first game
		if (this.buttonColours.length < 7) {
			this.populateColours();
		}
	}

	// change GameButton positions `buttonCount` times
	scrambleButtons() {
		const scrambleInterval = 2000; // 2 seconds
		const buttonAxes = Object.getOwnPropertyNames(this.#buttons[0].position);

		const scramble = (count) => {
			for (let button of this.#buttons) {
				// flexbox means top + left properties will be unset, set them manually
				const buttonPosition = button.domBtn.getBoundingClientRect();
				button.domBtn.style.left = buttonPosition.left + "px";
				button.domBtn.style.top = buttonPosition.top + "px";

				button.position = this.randomizeButtonPosition(buttonAxes, button.size);

				// remove flex and take control of positioning
				button.domBtn.style.position = "absolute";
				button.domBtn.style.left = button.position.xPos + "px";
				button.domBtn.style.top = button.position.yPos + "px";
				button.domBtn.classList.remove("flex");
			}
			if (count > 1) {
				setTimeout(() => scramble(count - 1), scrambleInterval);
			}
		};

		scramble(this.#buttonCount);

	}

	// event listeners for each GameButton object
	setButtonGuessEventListener(button) {
		button.domBtn.addEventListener('click', (event) => {
			event.preventDefault();
			this.incrementGuess();

			// user wins
			if (this.guess === button.order && this.guess === this.#buttonCount) {
				button.domBtn.textContent = button.order;
				const win = new Modal("win", this);
				win.dialog.showModal();
			}
			// correct guess
			else if (button.order === this.guess) {
				button.domBtn.textContent = button.order;
			}
			// Game Over
			else {
				const gameOver = new Modal("gameOver", this, this.#buttons);
				gameOver.dialog.showModal();
				gameOver.populateCorrectSequence();
				gameOver.animateSequence();
			}

		});
	}

	incrementGuess() {
		this.#guess += 1;
	}

	set buttonCount(count) { this.#buttonCount = count; }
	get guess() { return this.#guess; }
}
