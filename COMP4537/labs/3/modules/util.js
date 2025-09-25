class CurrentDate {
	getCurrentDate() {
		const now = new Date();
		return now.toString();
	}
}

module.exports = { CurrentDate };
