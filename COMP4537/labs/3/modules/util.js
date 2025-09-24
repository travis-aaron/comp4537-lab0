class CurrentDate {
	getCurrentDate() {
		const now = new Date();
		return now.toLocaleString();
	}
}

module.exports = { CurrentDate };
