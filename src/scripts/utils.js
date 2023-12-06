export function cnvrtFiveDayDate(date) {
	let secondSlashInd = date.replace("/", "").search("/") + 1;
	let time = date.substring(date.search(",") + 2);
	let timeFormatted = " " + time.substring(0, time.replace(":", "").search(":") + 1) + time.substring(time.length - 2);
	// timeFormatted = timeFormatted +
	let dateFormatted = date.substring(0, secondSlashInd + 1) + date.substring(secondSlashInd + 3, secondSlashInd + 5);

	return dateFormatted + timeFormatted;
}
