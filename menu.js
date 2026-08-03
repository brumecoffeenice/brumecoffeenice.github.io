const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

var actualLanguage = 0; //0=fr, 1=en
var showAllergens = false;
var showPregnancy = false;
var tree = [];

function showLanguageMenu() {
	languageBox0 = document.getElementById('languageBox0');
	languageBox1 = document.getElementById('languageBox1');
	languageSwitch = document.getElementById('languageSwitch');
	languageBox0.textContent = 'français';
	languageBox1.textContent = 'english';

	languageSwitch.checked = (actualLanguage == 1);

	if (actualLanguage == 0) {
		languageBox0.classList.add('switch-label-active');
		languageBox1.classList.remove('switch-label-active');
	}
	else {
		languageBox1.classList.add('switch-label-active');
		languageBox0.classList.remove('switch-label-active');
	}
}

function showAllergenButton() {
	var label = document.getElementById('allergenLabel');
	var sw = document.getElementById('allergenSwitch');
	label.textContent = actualLanguage === 0 ? 'Allergènes' : 'Allergens';
	sw.checked = showAllergens;

	if (showAllergens) {
		label.classList.add('switch-label-active');
	} else {
		label.classList.remove('switch-label-active');
	}
}

function toggleAllergens(forceValue) {
	showAllergens = (typeof forceValue === 'boolean') ? forceValue : !showAllergens;
	// Toggle visibility directly without a full re-render
	document.querySelectorAll('.allergen-row:not(.row-pregnancy)').forEach(function (row) {
		if (showAllergens) {
			row.classList.remove('allergen-hidden');
		} else {
			row.classList.add('allergen-hidden');
		}
	});
	showAllergenButton();
}

function showPregnancyButton() {
	var label = document.getElementById('pregnancyLabel');
	var sw = document.getElementById('pregnancySwitch');
	label.textContent = actualLanguage === 0 ? 'Grossesse' : 'Pregnancy';
	sw.checked = showPregnancy;

	if (showPregnancy) {
		label.classList.add('switch-label-active');
	} else {
		label.classList.remove('switch-label-active');
	}
}

function togglePregnancy(forceValue) {
	showPregnancy = (typeof forceValue === 'boolean') ? forceValue : !showPregnancy;
	// Toggle visibility directly without a full re-render
	document.querySelectorAll('.row-pregnancy').forEach(function (row) {
		if (showPregnancy) {
			row.classList.remove('allergen-hidden');
		} else {
			row.classList.add('allergen-hidden');
		}
	});
	showPregnancyButton();
}

function detectLanguage() {
	let lang = navigator.language
	if (lang.startsWith("fr")) {
		actualLanguage = 0;
	}
	else {
		actualLanguage = 1;
	}
}

function displayReviewBox() {
	visitcount = getVisitCount();
	const dialog = document.querySelector("dialog");

	if (visitcount >= 2) {
		dialog.showModal();
	}
}

async function main() {
	hash = window.location.hash.replace("#", "");
	var menulocal = 0;
	if (hash === "menulocal") {
		menulocal = 1;
		// alert("Attention, vous utilisez le menu local. Il risque de ne pas être à jour.");
	}

	if (hash === "black") {
		document.documentElement.setAttribute("data-theme", "black");
	}


	tree = await fetchToTree(menulocal);
	treeToElements(tree);
	showLanguageMenu();
	showAllergenButton();
	showPregnancyButton();
}

function refresh() {
	treeToElements(tree);
	showLanguageMenu();
	showAllergenButton();
	showPregnancyButton();
}

detectLanguage();
displayReviewBox();
main();

// Clicking "français"/"english" selects that language directly.
// Clicking the switch pill itself flips it independently
// (they're siblings, not nested in a <label>, so the two never
// fight over the same click).
languageBox0.addEventListener("click", function () { actualLanguage = 0; refresh(); });
languageBox1.addEventListener("click", function () { actualLanguage = 1; refresh(); });
document.getElementById('languageSwitch').addEventListener("change", function () {
	actualLanguage = this.checked ? 1 : 0;
	refresh();
});

document.getElementById('allergenSwitch').addEventListener("change", function () {
	toggleAllergens(this.checked);
});
document.getElementById('pregnancySwitch').addEventListener("change", function () {
	togglePregnancy(this.checked);
});

// Clicking "Allergènes"/"Grossesse" toggles them directly, same as the switch.
document.getElementById('allergenLabel').addEventListener("click", function () {
	toggleAllergens(!showAllergens);
});
document.getElementById('pregnancyLabel').addEventListener("click", function () {
	togglePregnancy(!showPregnancy);
});