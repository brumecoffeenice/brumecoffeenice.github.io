// Allergen dictionary : canonical French key -> { fr, en }
// Keys must match what is written in the .menu file (after normalisation)
const ALLERGENS = {
	"cereales": { texts: ["Céréales (gluten)", "Cereals (gluten)"] },
	"crustaces": { texts: ["Crustacés", "Crustaceans"] },
	"oeufs": { texts: ["Œufs", "Eggs"] },
	"poissons": { texts: ["Poissons", "Fish"] },
	"arachides": { texts: ["Arachides", "Peanuts"] },
	"soja": { texts: ["Soja", "Soy"] },
	"lait": { texts: ["Lait (lactose)", "Milk (lactose)"] },
	"fruits a coques": { texts: ["Fruits à coques", "Tree nuts"] },
	"celeri": { texts: ["Céleri", "Celery"] },
	"moutarde": { texts: ["Moutarde", "Mustard"] },
	"sesame": { texts: ["Sésame", "Sesame"] },
	"sulfites": { texts: ["Sulfites", "Sulphites"] },
	"lupin": { texts: ["Lupin", "Lupin"] },
	"mollusques": { texts: ["Mollusques", "Molluscs"] },
};

// Normalise a string for dictionary lookup :
// lowercase, strip accents, collapse whitespace
function normaliseAllergen(str) {
	return str.trim()
		.toLowerCase()
		.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip accents (é->e, à->a, etc.)
		.replace(/\s+/g, " ");
}

// Parse a raw comma-separated allergen string from the .menu file.
// Returns an array of { texts: [fr, en], known: bool }.
// Unknown entries (typos, unlisted values) are passed through as-is in both languages.
function parseAllergens(rawText) {
	return rawText.split(',').map(s => s.trim()).filter(Boolean).map(raw => {
		const norm = normaliseAllergen(raw);
		if (ALLERGENS[norm]) {
			return { texts: ALLERGENS[norm].texts, known: true };
		}
		return { texts: [raw, raw], known: false }; // unknown : display as-is
	});
}

// Pregnancy warnings dictionary : canonical French key -> { fr, en }
// Keys must match what is written in the .menu file (after normalisation)
const PREGNANCY_WARNINGS = {
	"lait cru": { texts: ["Lait cru / fromage au lait cru", "Unpasteurised milk / cheese"] },
	"oeuf cru": { texts: ["Œuf cru ou peu cuit", "Raw or undercooked egg"] },
	"poisson cru": { texts: ["Poisson cru", "Raw fish"] },
	"poisson fume": { texts: ["Poisson fumé", "Smoked fish"] },
	"viande crue": { texts: ["Viande crue ou peu cuite", "Raw or undercooked meat"] },
	"charcuterie": { texts: ["Charcuterie non cuite", "Uncooked cured meat"] },
	"alcool": { texts: ["Alcool", "Alcohol"] },
	"graines germees": { texts: ["Graines germées crues", "Raw sprouted seeds"] },
	"cafeine": { texts: ["Caféine", "Cafeine"] },
};

// Parse a raw comma-separated pregnancy-warning string from the .menu file.
// Same logic as parseAllergens : unknown entries are passed through as-is
// and flagged, so typos are still visible (in red) on the site.
function parsePregnancyWarnings(rawText) {
	return rawText.split(',').map(s => s.trim()).filter(Boolean).map(raw => {
		const norm = normaliseAllergen(raw); // reuse same normalisation logic
		if (PREGNANCY_WARNINGS[norm]) {
			return { texts: PREGNANCY_WARNINGS[norm].texts, known: true };
		}
		return { texts: [raw, raw], known: false }; // unknown : display as-is
	});
}

// ─────────────────────────────────────────────────────────────────────────────

function createCustomElement(element, type, containerType) {
	var newElement = document.createElement(type);
	var container = document.createElement(containerType);
	var aBox;
	var newElement = document.createElement(type);
	if (element.link) {
		aBox = document.createElement('a');
		aBox.href = element.link;
		container.appendChild(aBox);
		// container.appendChild(newElement);
		aBox.appendChild(newElement);
		aBox.classList.add('linkStyle');
		newElement.textContent = element.texts[actualLanguage];
	} else {
		aBox = document.createElement('a');
		aBox.href = element.link;
		container.appendChild(newElement);
		newElement.textContent = element.texts[actualLanguage];
	}
	return container;
}

function createBlocContainer(bloc) {
	if (bloc.texts[0][0] == '!') {
		var menuBox = document.getElementById('menuBox');
		var blocContainer = document.createElement('col-card-left');		// contains our hole new menu
		menuBox.appendChild(blocContainer);
		return blocContainer;
	} else if (bloc.texts[0][0] == '>') {
		var targetBox = document.getElementById(bloc.texts[0].substring(1));
		targetBox.innerHTML = '';
		var blocContainer = document.createElement('col-card-left');		// contains our hole new menu
		targetBox.appendChild(blocContainer);
		return blocContainer;
	} else {
		var menuBox = document.getElementById('menuBox');
		var blocContainer = document.createElement('card-menu');		// contains our hole new menu
		var leftContainer = document.createElement('col-card-left');	// for the vertical menu name
		var rightContainer = document.createElement('col-card-right');	// for the content of the menu
		var newElement = document.createElement('style-menu');		// for the sliding menu name

		menuBox.appendChild(blocContainer);
		blocContainer.appendChild(leftContainer);
		blocContainer.appendChild(rightContainer);
		leftContainer.appendChild(newElement);

		newElement.classList.add('menuName');
		newElement.textContent = bloc.texts[actualLanguage];
		return rightContainer;
	}
}

// Build the allergen row for a product element.
// Finds the type-5 child (optional), returns null if absent.
function createAllergenRow(element) {
	var allergens = parseAllergens(element.texts[0]);
	if (allergens.length === 0) return null;

	var row = document.createElement('row-allergens');
	var label = document.createElement('style-allergen-label');
	label.textContent = actualLanguage === 0 ? 'Allergènes :' : 'Allergens:';
	row.appendChild(label);

	for (var a of allergens) {
		var pill = document.createElement('style-allergen-pill');
		if (!a.known) pill.classList.add('allergen-unknown');
		pill.textContent = a.texts[actualLanguage];
		row.appendChild(pill);
	}

	return row;
}

// Build the pregnancy-warning row for a product element.
// Finds the type-7 child (optional), returns null if absent.
function createPregnancyRow(element) {
	var warnings = parsePregnancyWarnings(element.texts[0]);
	if (warnings.length === 0) return null;

	var row = document.createElement('row-allergens');
	row.classList.add('row-pregnancy');
	var label = document.createElement('style-allergen-label');
	label.textContent = actualLanguage === 0 ? 'Grossesse :' : 'Pregnancy:';
	row.appendChild(label);

	for (var w of warnings) {
		var pill = document.createElement('style-allergen-pill');
		pill.classList.add('pregnancy-pill');
		if (!w.known) pill.classList.add('allergen-unknown');
		pill.textContent = w.texts[actualLanguage];
		row.appendChild(pill);
	}

	return row;
}

function treeToElements(tree) {
	var menuBox = document.getElementById('menuBox');
	menuBox.innerHTML = '';

	// iterate over nodes of level 0 : blocs
	for (var bloc of tree.children) {
		var blocContainer = createBlocContainer(bloc);

		console.log(bloc)
		// iterate over nodes of level 1 : elements
		for (var element of bloc.children) {
			switch (element.type) {
				case '1':
					var newelement = createCustomElement(element, 'style-category', 'row-center');
					newelement.classList.add("category-section");
					blocContainer.appendChild(newelement);
					break;
				case '2':
					var produitPrixContainer = document.createElement('row-product-price');
					var produit = document.createElement('style-product');
					var dots = document.createElement('style-dots');
					var prix = document.createElement('style-price');

					produitPrixContainer.appendChild(produit);
					produitPrixContainer.appendChild(dots);
					produitPrixContainer.appendChild(prix);

					produit.textContent = element.texts[actualLanguage];
					prix.textContent = parseFloat(element.children[0].texts[0]) + "€"; // if error, this element has no price !
					blocContainer.appendChild(produitPrixContainer);
					break;
				case '4':
					blocContainer.appendChild(createCustomElement(element, 'style-description', 'row-left'));
					break;
				case '5':
					// allergènes : optionnel, masqué par défaut
					var allergenRow = createAllergenRow(element);
					if (allergenRow) {
						allergenRow.classList.add('allergen-row');
						if (!showAllergens) allergenRow.classList.add('allergen-hidden');
						blocContainer.appendChild(allergenRow);
					}
					break;
				case '6':
					// grossesse : optionnel, masqué par défaut
					var pregnancyRow = createPregnancyRow(element);
					if (pregnancyRow) {
						pregnancyRow.classList.add('allergen-row');
						if (!showPregnancy) pregnancyRow.classList.add('allergen-hidden');
						blocContainer.appendChild(pregnancyRow);
					}
					break;
				case '7':
					blocContainer.appendChild(createCustomElement(element, 'style-comment', 'row-center'));
					break;
				default:
					console.error("there is an unexpected type in the list");
					break;
			}
		}
	}
}