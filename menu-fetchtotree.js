
// fetched from database
async function fetcher() {
	// ************** from supabase **************
	let { data, error } = await _supabase
		.from('menu.menu')
		.select('content')
		.limit(1)
		.order("id", { ascending: false })

	if (error) {
		console.error("fetch error", error);
		throw error;
	}
	text = data[0].content;

	// ************** from text file **************
	// let response = await fetch('menu.menu');
	// let text = await response.text();

	// **************                 **************
	return text;
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

async function fetchToTree() {
	var text = await fetcher();

	var tokens = getTokens(text);
	tokens = setTreeLevels(tokens);
	var tree = getTree(tokens);

	return tree;
}