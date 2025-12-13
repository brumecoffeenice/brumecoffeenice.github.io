const MENU_TIMEOUT_MS = 8000;

/** Mets un warning visible si un élément existe (sinon juste console) */
function setMenuWarning(message) {
	console.warn(message);
	const el = document.getElementById("menu-warning"); // optionnel
	if (el) {
		el.textContent = message;
		el.style.display = "";
	}
}

/** Clear warning (si tu veux) */
function clearMenuWarning() {
	const el = document.getElementById("menu-warning");
	if (el) {
		el.textContent = "";
		el.style.display = "none";
	}
}

/** Charge le menu local (fichier) */
async function fetchLocalMenuText() {
	const response = await fetch("menu.menu", { cache: "no-cache" });
	if (!response.ok) throw new Error(`Local menu fetch failed (${response.status})`);
	return await response.text();
}

/** Charge le menu depuis Supabase */
async function fetchSupabaseMenuText(_supabase) {
	const { data, error } = await _supabase
		.from("menu.menu")
		.select("content")
		.limit(1)
		.order("id", { ascending: false });

	if (error) throw error;

	// data peut être [] si la table est vide
	return data?.[0]?.content ?? "";
}

/** Timeout générique */
function withTimeout(promise, ms, label = "Timeout") {
	return Promise.race([
		promise,
		new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms)),
	]);
}

function isBlank(str) {
	return !str || str.trim().length === 0;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * fetched from database
 * - menulocal == 1 => force local
 * - sinon => supabase (timeout 8s) ; si erreur/timeout/vide => local
 *
 * Retourne: string (le contenu du menu)
 */
async function fetcher(menulocal) {
	// si tu veux éviter un warning qui reste affiché
	clearMenuWarning();

	// 0) sécurité : supabase client doit exister
	// (tu dois avoir défini _supabase = supabase.createClient(URL, KEY))
	if (typeof _supabase === "undefined" || !_supabase) {
		// Si pas de client, on tombe direct sur local avec warning
		const text = await fetchLocalMenuText();
		setMenuWarning("Menu local utilisé, peut être pas à jour ! client Supabase non initialisé.");
		return text;
	}

	// 1) Forcer local (#local)
	if (menulocal == 1) {
		const text = await fetchLocalMenuText();
		setMenuWarning("Menu local utilisé, peut être pas à jour ! mode #local activé.");
		return text;
	}

	// 2) Tentative Supabase + timeout 8s
	try {
		const text = await withTimeout(
			fetchSupabaseMenuText(_supabase),
			MENU_TIMEOUT_MS,
			"Supabase timeout"
		);

		// Supabase répond mais vide => fallback local
		if (isBlank(text)) {
			const localText = await fetchLocalMenuText();
			setMenuWarning("Menu local utilisé, peut être pas à jour ! menu Supabase vide.");
			return localText;
		}

		return text;
	} catch (err) {
		// Timeout / erreur supabase => fallback local
		const localText = await fetchLocalMenuText();
		setMenuWarning("Menu local utilisé, peut être pas à jour ! Supabase indisponible (timeout/erreur).");
		return localText;
	}
}










// lexes tokens
function getTokens(text) {
	var tokens = [];
	var cleanInput = text;
	cleanInput = cleanInput.replace(/(\r\n)/gm, "\n"); //set \n as delimiter by replacing \r\n
	cleanInput = cleanInput.replace(/(\r)/gm, "\n"); //set \n as delimiter by replacing \r
	cleanInput = cleanInput.replace(/^#.*\n*/gm, ""); //remove comments : lines starting with commentator 
	cleanInput = cleanInput.replace(/^\n/gm, ""); //remove empty lines

	var lines = cleanInput.split('\n'); //corpus is the rest

	for (var line of lines) {
		var slices = line.split('_'); // all slices in the line including blanks, translations...
		for (i in slices) {
			var slice = slices[i];
			var subslices = slice.split('@');

			var text0 = subslices[0];
			var text1 = subslices[1];
			var text2 = subslices[2];

			if (text0)
				text0 = text0.replace(/^\s+|\s+$/g, ""); // remove whistaces ar beginning and end
			if (text1)
				text1 = text1.replace(/^\s+|\s+$/g, "");
			if (text2)
				text2 = text2.replace(/^\s+|\s+$/g, "");
			if (text0) {
				if (!text1)
					text1 = text0; // if an text0 has no text1, text1 is text0
				var token = {
					texts: [text0, text1],
					type: i,
					treeLevel: 0,
					link: text2
				};
				tokens.push(token);
			}
		}
	}
	return tokens;
}

function setTreeLevels(tokens) {
	for (var token of tokens) {
		if (token.type == 0)
			token.treeLevel = 0;
		if (token.type == 1)
			token.treeLevel = 1;
		if (token.type == 2)
			token.treeLevel = 1;
		if (token.type == 3)
			token.treeLevel = 2;
		if (token.type == 4)
			token.treeLevel = 1;
		if (token.type == 5)
			token.treeLevel = 1;
	}
	return tokens;
}

// #bloc _ categorie _ produit _ prix _ description _ commentaire
// tree format : 
// first type (blocs) : 0
// second type (categories, produit, description, commentaire) : 1, 2, 4, 5
// third type (prices) : 3
// WARNING a produit MUST have a childre prix

function getTree(tokens) {
	tree = {
		treeLevel: -1,
		children: []
	};
	let stack = [tree];  // Stack to keep track of tree levels

	for (var token of tokens) {
		var newNode = {
			texts: token.texts,
			type: token.type,
			treeLevel: token.treeLevel,
			link: token.link,
			children: []
		}

		while (stack.length > token.treeLevel + 1) {
			stack.pop();  // Pop the stack until we reach the correct parent level
		}

		// Add the new node to the parent's children
		stack[stack.length - 1].children.push(newNode);

		// Add the new node to the stack
		stack.push(newNode);
	}
	return tree;
}

async function fetchToTree(menulocal) {
	var text = await fetcher(menulocal);

	var tokens = getTokens(text);
	tokens = setTreeLevels(tokens);
	var tree = getTree(tokens);

	return tree;
}