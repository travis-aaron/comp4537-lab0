
// Buttons for memorization game (non ui)
export class GameButton {
	backgroundColour;
	labelText;
	#position = { xPos: 0, yPos: 0 };
	#size = { width: 0, height: 0 };
	domBtn;
	#order;

	constructor(colour, text, order) {
		this.labelText = text;
		this.#order = order;

		this.domBtn = document.createElement("button");
		this.domBtn.className = "button";
		this.domBtn.textContent = order;
		this.domBtn.disabled = true;

		this.backgroundColour = colour;
		this.domBtn.style.backgroundColor = colour;
	}


	set position(newPosition) { this.#position = newPosition; }

	get position() { return this.#position; };

	set size(dimensions) { this.#size = dimensions; }
	get size() { return this.#size; };
	get order() { return this.#order; };

}
