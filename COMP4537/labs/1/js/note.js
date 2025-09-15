export class Note {
	#name;
	#content;
	#created; // timestamp
	#edited; // boolean
	#needsUpdate;

	constructor(content) {
		// use UUID to avoid name collisions
		this.#name = crypto.randomUUID();
		this.#content = content;
		this.#created = Date.now();
		this.#edited = false;
		this.#needsUpdate = true;
	}

	// can only be changed to true
	setEdited() {
		this.#edited = true;
	}

	// returns a JSON string to store in localStorage
	toJSONString() {
		const object = {
			name: this.#name,
			content: this.#content,
			created: this.#created,
			edited: this.#edited,
		};
		return JSON.stringify(object);
	}

	editContent(newContent) {
		if (this.#content !== newContent) {
			this.#content = newContent;
			this.#edited = true;
			this.#needsUpdate = true;
		}
	}

	updatedUI() {
		this.#needsUpdate = false;
	}

	get needsUpdate() { return this.#needsUpdate; }
	get name() { return this.#name }
	get created() { return this.#created }
	get content() { return this.#content }
	get edited() { return this.#edited }

	set name(newName) { this.#name = newName; }
	set content(newContent) { this.#content = newContent; }

	// reset timestamp to match one stored in localStorage
	set created(timestamp) { this.#created = timestamp; }
}
