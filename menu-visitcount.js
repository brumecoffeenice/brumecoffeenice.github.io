// Function to format the current date as YYYY-MM-DD
function getCurrentDate() {
	let today = new Date();
	return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

// Function to get the visit dates from localStorage
function getVisitDates() {
	let visits = localStorage.getItem('visitDates');
	return visits ? JSON.parse(visits) : [];
}

// Function to save the visit dates back to localStorage
function saveVisitDates(dates) {
	localStorage.setItem('visitDates', JSON.stringify(dates));
}

// Main logic to handle visits
function getVisitCount() {
	let visitDates = getVisitDates();
	let currentDate = getCurrentDate();

	// Add the current date to the list if it's not already in it
	if (!visitDates.includes(currentDate)) {
		visitDates.push(currentDate);
	}

	// Save the updated visit dates
	saveVisitDates(visitDates);

	console.log("your visite count", visitDates.length);
	console.log("your visit dates", visitDates);

	return (visitDates.length)
}
