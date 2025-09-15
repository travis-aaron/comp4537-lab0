import { errors, removeButtonText } from '../lang/messages/en/user.js';

export class UIElement {
	type;
	currentPage;
	domElement;
	eventListener;
	externalControl;

	constructor(type, currentPage) {
		this.type = type;
		this.currentPage = currentPage;
		this.domElement = null;
		this.eventListener = null;
		this.externalControl = null;
	}

	// force subclasses to override
	createElement() {
		throw new Error(errors.requiredMethod);
	}

	remove() {
		if (this.domElement) {
			this.domElement.remove();
		}
	}
}
export class TimestampElement extends UIElement {
	createElement() {
		this.domElement = document.createElement('div');
		this.domElement.className = 'timestamp';
		this.domElement.textContent = `${this.getLastSavedTime()}`;
		return this.domElement;
	}

	getLastSavedTime() {
		return new Date().toLocaleString();
	}
}

export class NoteFrameElement extends UIElement {
	createElement() {
		this.domElement = document.createElement('div');
		this.domElement.className = 'notes-container';
		return this.domElement;
	}
}

export class NoteElement extends UIElement {
	constructor(currentPage, note, readOnly = false) {
		super('note', currentPage);
		this.note = note;
		this.readOnly = readOnly;
		this.autoSaveInterval = null;
		this.hasUnsavedChanges = false;
		this.lastSavedContent = note.content;
	}

	createElement() {
		this.domElement = document.createElement('div');
		this.domElement.className = `note-item${this.isReadOnly ? 'read-only' : ''}`;

		const textarea = document.createElement('textarea');
		textarea.id = this.note.name;
		textarea.value = this.note.content;

		this.domElement.appendChild(textarea);

		// disable editing notes in Reader
		if (this.readOnly) {
			textarea.disabled = true;
		} else { // add editing capability for Writer
			this.createEventListeners(textarea);
			this.createRemoveButton();
		}

		return this.domElement;
	}


	// create event listeners for updating notes
	createEventListeners(textarea) {
		// clicking off the textarea
		textarea.addEventListener('blur', () => this.handleBlur(textarea.value));
		// typing inside the textarea
		textarea.addEventListener('input', (e) => this.handleInput(e.target.value));

	}
	createRemoveButton() {
		this.externalControl = document.createElement('button');
		this.externalControl.textContent = removeButtonText;
		this.externalControl.addEventListener('click', () => this.handleRemove());
		this.domElement.appendChild(this.externalControl);
	}

	// save while typing
	handleInput(newContent) {
		if (this.readOnly) return; // doesn't apply to Reader

		// only save if there's new content
		if (newContent !== this.lastSavedContent) {
			this.hasUnsavedChanges = true;

			if (!this.autoSaveInterval) {
				// slightly faster on first save - avoids 3 second delay
				setTimeout(() => this.saveCurrentContent(), 1500);
				this.autoSaveInterval = setInterval(() => this.saveCurrentContent(), 2000);
			}
		}
	}

	// check if content needs to be saved
	saveCurrentContent() {
		if (this.hasUnsavedChanges) {
			const currentContent = this.domElement.querySelector('textarea').value;
			this.dispatchSaveEvent(currentContent, 'autoSave');
			this.hasUnsavedChanges = false;
			this.lastSavedContent = currentContent;
		}
	}


	// save when clicking outside textarea
	handleBlur(content) {
		if (this.readOnly) return; // doesn't apply to Reader

		this.clearAutoSave();
		if (content !== this.lastSavedContent) {
			this.dispatchSaveEvent(content, 'manualSave');
			this.hasUnsavedChanges = false;
			this.lastSavedContent = content;
		}
	}

	handleRemove() {
		// CustomEvent functions like a built-in observer pattern
		// using it here prevents NoteElement and TimestampElement from being tightly coupled
		const event = new CustomEvent('noteRemove', { detail: this.note.name });
		document.dispatchEvent(event);
	}


	dispatchSaveEvent(content, saveType) {
		const event = new CustomEvent('noteSave', {
			detail: {
				noteId: this.note.name,
				content: content,
				saveType: saveType
			}
		});
		document.dispatchEvent(event);
	}

	clearAutoSave() {
		if (this.autoSaveInterval) {
			clearInterval(this.autoSaveInterval);
			this.autoSaveInterval = null;
		}
	}

	// stop autosave timer
	destroy() {
		this.clearAutoSave();
		super.remove();
	}
}
