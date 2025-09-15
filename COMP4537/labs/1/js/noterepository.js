import { Note } from './note.js';

export class NoteRepository {
	#noteNames;
	#notes;

	constructor() {
		this.#noteNames = [];
		this.#notes = [];
		this.#findNoteNames();
		this.#loadNotesFromStorage();
	}

	// return a single Note
	getNote(targetName) {
		return this.#notes.find(({ name }) => name === targetName);
	}

	/* takes a Note instance and adds to #notes and #noteNames
	returns true if successful or false if note exists */
	async addNote(note) {
		if (this.#noteExists(note.name)) {
			return false;
		}

		this.#noteNames.push(note.name);
		this.#notes.push(note);

		localStorage.setItem(note.name, note.toJSONString());
		return true;
	}

	// removes note from #noteNames and #notes
	deleteNote(noteName) {
		const index = this.#noteNames.indexOf(noteName);
		if (index > -1) {
			this.#noteNames.splice(index, 1);
			this.#notes.splice(index, 1);
			localStorage.removeItem(noteName);
		}
	}

	// collect note names for easy reference
	#findNoteNames() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) this.#noteNames.push(key);
		}
	}

	// populate notes from localStorage
	#loadNotesFromStorage() {
		const loadedNotes = [];

		this.#noteNames.forEach(name => {
			const noteData = JSON.parse(localStorage.getItem(name));
			const note = new Note(noteData.content);
			note.name = noteData.name;


			note.created = noteData.created;

			loadedNotes.push(note);
		});

		// sort oldest notes first
		loadedNotes.sort((a, b) => a.created - b.created);

		this.#notes = loadedNotes;
	}

	saveNote(note) {
		localStorage.setItem(note.name, note.toJSONString());
	}

	#noteExists(noteName) {
		if (this.#noteNames.includes(noteName)) {
			return true;
		}
		return false;
	}


	get notes() { return this.#notes; }
}
