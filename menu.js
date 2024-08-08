const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

var actualLanguage = 0; //0=fr, 1=en
var text = ""; // text stored in supabase
var header0 = [];
var header1 = [];
var tokens = []; // element, translation (mandatory), level

// fetched from database
async function fetcher() {
	let { data, error } = await _supabase
		.from('menu.menu')
		.select('content')
		.limit(1)
		.order("id", { ascending: false })

	if (error) {
		console.log("ERROR", error);
		throw error;
	}
	text = data[0].content;
	lexer(text);
}

// lexes tokens
function lexer(text) {
	var cleanInput = text;
	tokens = [];
	cleanInput = cleanInput.replace(/(\r\n)/gm, "\n"); //set \n as delimiter by replacing \r\n
	cleanInput = cleanInput.replace(/(\r)/gm, "\n"); //set \n as delimiter by replacing \r
	cleanInput = cleanInput.replace(/^#.*\n*/gm, ""); //remove comments : lines starting with commentator 
	cleanInput = cleanInput.replace(/^\n/gm, ""); //remove empty lines

	header0 = cleanInput.split('\n')[0].replace(/\s/g, "").split('_'); // header0 is the first row, remove whitespaces and split
	header1 = cleanInput.split('\n')[1].replace(/\s/g, "").split('/'); //header1 is the second row
	var lines = cleanInput.split('\n').slice(2); //corpus is the rest

	for (line of lines) {
		var slices = line.split('_'); // all slices in the line including blanks, translations...
		for (i in slices) {
			var slice = slices[i];
			var sslices = slice.split('/');
			var element = sslices[0];
			var translation = sslices[1];

			if (element)
				element = element.replace(/^\s+|\s+$/g, ""); // remove whistaces ar beginning and end
			if (translation)
				translation = translation.replace(/^\s+|\s+$/g, "");
			if (element) {
				if (!translation)
					translation = element; // if an element has no translation, translation is element
				level = header0[i]; // set the according level from header
				if (!level)
					level = 'undefined';
				tokens.push([element, translation, level]);
			}
		}
	}
	elementCreator();
}

function createElementInContainer(text, type, containerType) {
	var container = document.createElement(containerType);
	var newElement = document.createElement(type);
	container.appendChild(newElement);
	newElement.textContent = text;
	return container;
}

function appendToLastMenuContainer(newElement) {
	var menuContainers = document.getElementsByClassName('menuContainer');
	var lastMenuContainer = menuContainers[menuContainers.length - 1];
	if (lastMenuContainer) {  //if it exists, append to lastMenuContainer
		lastMenuContainer.appendChild(newElement);
	} else {  // thus, this is the intro
		var content = document.getElementById('introBox');
		content.appendChild(newElement);
	}
}

function elementCreator() {
	var content = document.getElementById('content');
	var menuScroller = document.getElementById('menuScroller');
	var introBox = document.getElementById('introBox');
	content.innerHTML = '';
	// menuScroller.innerHTML = '';
	introBox.innerHTML = '';

	var i = 0;
	while (i < tokens.length) {
		switch (tokens[i][2]) {
			case 'menu':
				var mainContainer = document.createElement('mainR');		// contains our hole new menu
				var leftContainer = document.createElement('leftMainC');	// for the vertical menu name
				var rightContainer = document.createElement('rightMainC');	// for the content of the menu
				var newElement = document.createElement('menuStyle');		// for the sliding menu name

				content.appendChild(mainContainer);
				mainContainer.appendChild(leftContainer);
				mainContainer.appendChild(rightContainer);
				leftContainer.appendChild(newElement);

				rightContainer.classList.add('menuContainer');
				newElement.classList.add('menuName');
				newElement.textContent = tokens[i][actualLanguage];
				// leftContainer.setAttribute('onclick', "scrollToMenuScroller()");
				break;
			case 'produit':
				var produitPrixContainer = document.createElement('produitPrixR');
				var produit = document.createElement('produitStyle');
				var prix = document.createElement('prixStyle');

				produitPrixContainer.appendChild(produit);
				produitPrixContainer.appendChild(prix);

				produit.textContent = tokens[i][0];
				prix.textContent = parseFloat(tokens[++i][0]) + "€";
				appendToLastMenuContainer(produitPrixContainer)
				break;
			case 'description':
				var container = createElementInContainer(tokens[i][actualLanguage], 'descriptionStyle', 'leftR')
				appendToLastMenuContainer(container);
				break;
			case 'categorie':
				var container = createElementInContainer(tokens[i][actualLanguage], 'categorieStyle', 'centerR')
				appendToLastMenuContainer(container);
				break;
			case 'commentaire':
				var container = createElementInContainer(tokens[i][actualLanguage], 'commentaireStyle', 'centerR')
				appendToLastMenuContainer(container);
				break;
			default:
				var container = createElementInContainer(tokens[i][actualLanguage], 'defautStyle', 'centerR')
				appendToLastMenuContainer(container);
				break;
		}
		i++;
	}
	showLanguageMenu();
	// fillMenuScroller();
}

// function scrollToMenu() {
// 	var menuNames = document.getElementsByClassName('menuName');
// 	for (menuName of menuNames) {
// 		if (menuName.textContent == this.textContent)
// 			menuName.parentNode.scrollIntoView({ behavior: "smooth" });
// 	}
// }

// function scrollToMenuScroller() {
// 	var menuScroller = document.getElementById('menuScroller');
// 	menuScroller.scrollIntoView({ behavior: "smooth" });
// }

// function fillMenuScroller() {
// 	var menuNames = document.getElementsByClassName('menuName');
// 	var menuScroller = document.getElementById('menuScroller');
// 	menuScroller.innerHTML = "";

// 	for (menuName of menuNames) {
// 		var newButton = document.createElement('menuButton');
// 		menuScroller.appendChild(newButton);
// 		newButton.textContent = menuName.textContent;
// 		newButton.addEventListener("click", scrollToMenu);
// 	}
// 	showLanguageMenu();
// }

function showLanguageMenu() {
	languageBox0 = document.getElementById('languageBox0');
	languageBox1 = document.getElementById('languageBox1');
	languageBox0.textContent = header1[0];
	languageBox1.textContent = header1[1];

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

detectLanguage();
fetcher();

languageBox0.addEventListener("click", function () { actualLanguage = 0; elementCreator(); });
languageBox1.addEventListener("click", function () { actualLanguage = 1; elementCreator(); });
