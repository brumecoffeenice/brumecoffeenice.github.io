const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

var actualLanguage = 0; //0=fr, 1=en
var tree = [];

function showLanguageMenu() {
	languageBox0 = document.getElementById('languageBox0');
	languageBox1 = document.getElementById('languageBox1');
	languageBox0.textContent = 'français';
	languageBox1.textContent = 'english';

	if (actualLanguage == 0) {
		languageBox0.classList.add('actualLanguage');
		languageBox1.classList.remove('actualLanguage');
	}
	else {
		languageBox1.classList.add('actualLanguage');
		languageBox0.classList.remove('actualLanguage');
	}
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
	if (visitcount >= 3) {
		introBox = document.getElementById("introBox");
		introBox.style.display = 'none';
	} else {
		reviewBox = document.getElementById("reviewBox");
		reviewBox.style.display = 'none';
	}
}

async function main() {
	tree = await fetchToTree();
	treeToElements(tree);
	showLanguageMenu();
}

function refresh() {
	treeToElements(tree);
	showLanguageMenu();
}

detectLanguage();
displayReviewBox();
main();

languageBox0.addEventListener("click", function () { actualLanguage = 0; refresh(); });
languageBox1.addEventListener("click", function () { actualLanguage = 1; refresh(); });
