
function createCustomElement(element, type, containerType) {
	var newElement = document.createElement(type);
	var container = document.createElement(containerType);
	var aBox;
	if (element.link) {
		aBox = document.createElement('a');
		aBox.href = element.link;
		container.appendChild(aBox);
		// container.appendChild(newElement);
		aBox.appendChild(newElement);
		newElement.textContent = element.texts[actualLanguage];
		newElement.classList.add('linkStyle');
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
		var blocContainer = document.createElement('leftMainC');		// contains our hole new menu
		menuBox.appendChild(blocContainer);
		return blocContainer;
	} else if (bloc.texts[0][0] == '>') {
		var targetBox = document.getElementById(bloc.texts[0].substring(1));
		targetBox.innerHTML = '';
		var blocContainer = document.createElement('leftMainC');		// contains our hole new menu
		targetBox.appendChild(blocContainer);
		return blocContainer;
	} else {
		var menuBox = document.getElementById('menuBox');
		var blocContainer = document.createElement('mainR');		// contains our hole new menu
		var leftContainer = document.createElement('leftMainC');	// for the vertical menu name
		var rightContainer = document.createElement('rightMainC');	// for the content of the menu
		var newElement = document.createElement('menuStyle');		// for the sliding menu name

		menuBox.appendChild(blocContainer);
		blocContainer.appendChild(leftContainer);
		blocContainer.appendChild(rightContainer);
		leftContainer.appendChild(newElement);

		newElement.classList.add('menuName');
		newElement.textContent = bloc.texts[actualLanguage];
		return rightContainer;
	}
}

function treeToElements(tree) {
	var menuBox = document.getElementById('menuBox');
	menuBox.innerHTML = '';

	// iterate over nodes of level 0 : blocs
	for (var bloc of tree.children) {
		var blocContainer = createBlocContainer(bloc);

		// iterate over nodes of level 1 : elements
		for (var element of bloc.children) {
			switch (element.type) {
				case '1':
					var newelement = createCustomElement(element, 'categorieStyle', 'centerR');
					newelement.classList.add("categoriecanterr");
					blocContainer.appendChild(newelement);
					break;
				case '2':
					var produitPrixContainer = document.createElement('produitPrixR');
					var produit = document.createElement('produitStyle');
					var prix = document.createElement('prixStyle');

					produitPrixContainer.appendChild(produit);
					produitPrixContainer.appendChild(prix);

					produit.textContent = element.texts[actualLanguage];
					prix.textContent = parseFloat(element.children[0].texts[0]) + "€"; // if error, this element has no price !
					blocContainer.appendChild(produitPrixContainer);
					break;
				case '4':
					blocContainer.appendChild(createCustomElement(element, 'descriptionStyle', 'leftR'));
					break;
				case '5':
					blocContainer.appendChild(createCustomElement(element, 'commentaireStyle', 'centerR'));
					break;
				default:
					console.error("there is an unexpected type in the list");
					break;
			}
		}
	}
}

