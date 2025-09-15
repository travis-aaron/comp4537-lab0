import { Note } from './note.js';
import { NoteRepository } from './noterepository.js';
import { TimestampElement, NoteFrameElement, NoteElement } from './uielement.js';
import { indexTitle, lastSaved, addButtonText, backButtonText, writerLink, readerLink } from '../lang/messages/en/user.js';

export class Layout {
	constructor(repository) {
		this.repository = repository;
		this.uiElements = new Map();
		this.timestampElement = null;
		this.readOnly = false
		this.enableCrossTabSync = false;
	}

	// create note in DOM
	addNoteToUI(note, container) {
		const noteElement = new NoteElement('write', note, this.readOnly);
		const domElement = noteElement.createElement();
		container.appendChild(domElement);
		this.uiElements.set(note.name, noteElement);
	}

	createBackButton(container) {
		const backButton = document.createElement('button');
		backButton.textContent = backButtonText;
		backButton.addEventListener('click', () => {
			window.location.href = 'index.html';
		});
		container.appendChild(backButton);
	}

	// top level page elements - title and content div 
	createContainer(containerId, labelContent) {
		const body = document.body;
		const container = document.createElement('div');
		container.id = containerId;

		const title = document.createElement('h1');
		title.textContent = labelContent;

		container.appendChild(title);
		body.appendChild(container);
	}

	createTimestampElement(container) {
		this.timestampElement = new TimestampElement('write');
		container.appendChild(this.timestampElement.createElement());
	}

	// create DOM elements for notes
	createNotesContainer(container) {
		const notesFrame = new NoteFrameElement('write');
		const frameElement = notesFrame.createElement();
		container.appendChild(frameElement);
		return frameElement;
	}

	// grab notes from repository
	renderAllNotes(container) {
		this.repository.notes.forEach(note => {
			this.addNoteToUI(note, container);
		});
	}

	setupNotePage() {

	}

	setupStorageListener() {
		if (!this.enableCrossTabSync) return;

		window.addEventListener('storage', (e) => {
			if (e.key && e.newValue) {
				this.refreshNotes();
			} else if (e.key && !e.newValue) {
				this.refreshNotes();
			}
		});
	}

	//
	refreshNotes() {
		// return if called from index (lacks repository)
		if (!this.repository) return;

		this.repository = new NoteRepository();

		const container = document.querySelector('.notes-container');
		if (container) {
			container.innerHTML = '';
			this.uiElements.clear();
			this.renderAllNotes(container);
			this.updateTimestamp();
		}
	}


	updateTimestamp() {
		if (this.timestampElement?.domElement) {
			this.timestampElement.domElement.textContent =
				`${lastSaved} ${this.timestampElement.getLastSavedTime()}`;
		}
	}
}

export class IndexLayout extends Layout {
	constructor() {
		super(null);
		this.setupIndexPage();
	}

	// simpler setup for Index page Reader / Writer
	setupIndexPage() {
		this.createContainer('main-page', `${indexTitle}`);
		this.createNavigationButtons();
	}


	// navigate to reader.html and writer.html
	createNavigationButtons() {
		const container = document.querySelector('#main-page');

		const navContainer = document.createElement('div');
		navContainer.id = 'nav';

		const writerBtn = document.createElement('button');
		writerBtn.textContent = writerLink;
		writerBtn.addEventListener('click', () => {
			window.location.href = 'writer.html';
		});

		const readerBtn = document.createElement('button');
		readerBtn.textContent = readerLink;
		readerBtn.addEventListener('click', () => {
			window.location.href = 'reader.html';
		});

		navContainer.appendChild(writerBtn);
		navContainer.appendChild(readerBtn);
		container.appendChild(navContainer);
	}
}
export class ReaderLayout extends Layout {
	constructor() {
		const repository = new NoteRepository();
		super(repository);

		this.readOnly = true;
		this.enableCrossTabSync = true;
		this.createContainer('read-page', readerLink);
		this.setupReaderPage();
		this.setupStorageListener();
	}

	// populate inner div - exclude add button and event handlers
	setupReaderPage() {
		const container = document.querySelector('#read-page');

		this.createTimestampElement(container);
		const notesContainer = this.createNotesContainer(container);
		this.renderAllNotes(notesContainer);
		this.createBackButton(container);

	}

}

export class WriterLayout extends Layout {
	constructor() {
		const repository = new NoteRepository();
		super(repository);

		this.enableCrossTabSync = true;
		this.createContainer('write-page', writerLink);
		this.setupWritePage();
		this.setupEventListeners();
		this.setupStorageListener();
	}


	// populate inner div container with notes, add button, and back button
	setupWritePage() {
		const container = document.querySelector('#write-page');

		this.createTimestampElement(container);
		const notesContainer = this.createNotesContainer(container);
		this.renderAllNotes(notesContainer);

		const buttonContainer = document.createElement('div');
		buttonContainer.id = 'buttons';

		this.createAddButton(buttonContainer);
		this.createBackButton(buttonContainer);

		container.appendChild(buttonContainer);

	}

	// add event listeners for saving and removing notes
	setupEventListeners() {
		document.addEventListener('noteSave', (e) => {
			const { noteId, content } = e.detail;
			const note = this.repository.notes.find(n => n.name === noteId);
			if (note) {
				note.editContent(content);
				this.repository.saveNote(note);
				this.updateTimestamp();
			}
		});
		document.addEventListener('noteRemove', (e) => {
			this.handleRemoveNote(e.detail);
		});
	}


	// create the Add button at bottom of screen
	createAddButton(container) {
		const addButton = document.createElement('button');
		addButton.textContent = addButtonText;
		addButton.addEventListener('click', () => this.handleAddNote());

		container.appendChild(addButton);
	}

	handleAddNote() {
		const newNote = new Note('');
		this.repository.addNote(newNote);

		const container = document.querySelector('#write-page .notes-container');
		this.addNoteToUI(newNote, container);
		this.updateTimestamp();
	}

	handleRemoveNote(noteName) {
		const uiElement = this.uiElements.get(noteName);
		if (uiElement) {
			uiElement.remove();
			this.uiElements.delete(noteName);
		}
		this.repository.deleteNote(noteName);
		this.updateTimestamp();
	}
}
