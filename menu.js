const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

var tableDelimiter = '_';
var actualLanguage = 0; //0=fr, 1=en
var popup_shown = 0
var actualMenu = 0;
var header;
var corpus;
var blocs;
var intro;
var menuNames;
var menuContents;

//show language selection tabs
function showLanguageMenu() {
	var res = "";

	res += "<language " + (actualLanguage == 0 ? "class = actualLanguageButton" : "") + ` onclick="actualLanguage=0;showMenu()">Français</language>`;
	res += "<language " + (actualLanguage == 1 ? "class = actualLanguageButton" : "") + ` onclick = "actualLanguage=1;showMenu()" > English</language > `;
	return (res);
}

function removeHorizontalBarBeforePrint(a) {
	const elements = a.document.getElementsByClassName('horizontalBar');
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}

//creates a new window with only the content of a dif to allow user to print it
//print a div
function printMenu() {
	var divContents = document.getElementsByTagName('menuC')[0].innerHTML;
	var a = window.open('', '', 'height=500, width=500');
	a.document.write('<link rel="stylesheet" href="menu.css">');
	a.document.write('<printC>');
	a.document.write(divContents);
	a.document.write('</printC>');
	removeHorizontalBarBeforePrint(a);

	//Degueulasse, please find a better way to wait until page loaded before print
	setTimeout(function () {
		a.print();
	}, 2000);
}

//show menu tabs
function showTabs() {
	var res = "";
	var menuName = "";
	var menuNameRaw = "";

	for (i = 0; i < menuNames.length; i++) {
		menuNameRaw = menuNames[i].split(tableDelimiter); //select actual menu name
		menuName = menuNameRaw[0]; //select right language
		if (actualLanguage == 1 && menuNameRaw[1])
			menuName = menuNameRaw[1];
		if (i == actualMenu) {
			res += '<button class = actualMenuButton onclick="actualMenu= ' + i + ';scrollShowMenu()">' + menuName + '</button>';
		}
		else {
			res += '<button onclick="actualMenu= ' + i + ';scrollShowMenu()">' + menuName + '</button>';
		}
	}
	return (res);
}

//returns formatted HTML of only one bloc
function processBloc(bloc, header) {
	var res = "";
	var lines = bloc.split('\n');
	var words = "";
	var word = "";
	var name = "";
	var price = "";

	var i;
	var j;

	for (i = 0; i < lines.length; i++) {
		words = lines[i].split(tableDelimiter);
		for (j = 0; j < words.length; j += 2) {
			word = words[j];
			if (word) {
				//select the translation (if any) which is right after current word
				if (actualLanguage == 1 && words[j + 1])
					word = words[j + 1];

				//select word style according to title
				//title is deduced from header string
				//unknown title will get default style
				switch (header[j]) {
					case "menu":
						//res += "<menu>" + word + "</menu>"; //shows the menu name
						break;
					case "categorie":
						res += "<hr class=horizontalBar>";
						res += "<category class = centerR>" + word + "</category>";
						break;
					case "produit":
						name = word; //A name MUST be followed by a price
						break;
					case "prix":
						price = parseFloat(word) + "€";
						res += "<namePriceR>"
						res += "<name>" + name + "</name>";
						res += "<price>" + price + "</price>";
						res += "</namePriceR>"
						break;
					case "description":
						res += "<description>" + word + "</description>";
						break;
					case "commentaire":
						res += "<comment class = centerR>" + word + "</comment>";
						break;
					default:
						res += "<default class = centerR>" + word + "</default>";
				}
			}
		}
	}
	return (res);
}

//returns formated table as HTML and also some other stuff
function showMenu() {
	var res = "";
	res += "<languageR id=scrollTarget>";
	res += showLanguageMenu();
	res += "</languageR>";
	res += processBloc(intro, header);
	res += "<buttonsC>";
	res += showTabs();
	res += "</buttonsC>";
	res += "<menuC>";
	res += processBloc(menuContents[actualMenu], header);
	res += "</menuC>";
	document.getElementById('content').innerHTML = res;
}

//get first lines of each string of an array of string
function getFirstLines(array) {
	return array.map(str => {
		const lines = str.split('\n'); //split the string into lines
		return lines[0]; //return the first line
	});
}

//get all lines except first of each string of an array of string
function getOtherLines(array) {
	return array.map(str => {
		const lines = str.split('\n'); //split the string into lines
		lines.shift(); //remove the first line
		return lines.join('\n'); //join the remaining lines back into a string
	});
}

//processes the menu.menu and feeds the HTML text to content
function loadElements(menuFile) {
	var cleanInput = menuFile;
	cleanInput = cleanInput.replace(/(\r\n)/gm, "\n"); //set \n as delimiter by replacing \r\n
	cleanInput = cleanInput.replace(/(\r)/gm, "\n"); //set \n as delimiter by replacing \r
	cleanInput = cleanInput.replace(/^\/\/.*\n*/gm, ""); //remove comments : lines starting with //
	cleanInput = cleanInput.replace(/^\n/gm, ""); //remove empty lines

	header = cleanInput.split('\n')[0].split(tableDelimiter); //header is the first row
	corpus = cleanInput.split('\n').slice(1).join('\n'); //corpus is the rest
	blocs = corpus.split(RegExp("\n(?=[^" + tableDelimiter + "])")); //each new row starting with (not a delimiter) is the begining of a new bloc
	intro = blocs[0]; //first bloc is the intro
	menus = blocs.slice(1); //other blocs are menus. Includes menu names
	menuNames = getFirstLines(menus); //first line of each menu is the name
	menuContents = getOtherLines(menus); //rest is the content
}

//fetches the table from server
// async function initMenu() {
// 	let response = await fetch('menu.menu');
// 	let menuFile = await response.text();
// 	loadElements(menuFile);
// 	showMenu();
// }

async function initMenu() {
	let { data, error } = await _supabase
		.from('menu.menu')
		.select('content')
		.limit(1)
		.order("id", { ascending: false })

	if (error) {
		console.log("ERROR", error);
		throw error;
	}
	loadElements(data[0].content);
	showMenu();
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

function showPopup() {
	document.querySelector('.parallax').addEventListener('scroll', function () {
		if (this.scrollTop > 0 && popup_shown == 0) {
			if (actualLanguage == 0) {
				alert("Bonjour cher client, \nJe vous prie d'attendre d'être placés avant de vous asseoir,\nainsi que de réaliser vos commandes au comptoir\n❤️");
			}
			else {
				alert("Hello dear customer,\nPlease wait to be seated and place your order at the counter\n❤️");
			}
			popup_shown = 1;
		}
	});
}

detectLanguage();
showPopup();
initMenu();
