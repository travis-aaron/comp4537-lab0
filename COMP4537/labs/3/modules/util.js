export class CurrentDate {
	getCurrentDate() {
		const now = new Date();
		return now.toLocaleString();
	}
}
