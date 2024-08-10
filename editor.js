const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)
let storedMenu = "";

// document.addEventListener("DOMContentLoaded", fetchMenu)

saveButton.addEventListener('click', function () {
	pushMenu(emailBox.value, passwordBox.value);
})

async function fetchMenu() {
	let { data, error } = await _supabase
		.from('menu.menu')
		.select('content')
		.limit(1)
		.order("id", { ascending: false })

	if (error) {
		console.log("ERROR", error);
		throw error;
	}
	return (data[0].content);
}

async function getMenu() {
	let menuFile = await fetchMenu();
	menuFile = menuFile.replace(/(\r\n)/gm, "\n"); //set \n as delimiter by replacing \r\n
	menuFile = menuFile.replace(/(\r)/gm, "\n"); //set \n as delimiter by replacing \r
	return menuFile;
}

function copyMenuToClip2() {
	var copyText = $("#in").val();
	navigator.clipboard
		.writeText(copyText)
		.then(() => {
			alert("Menu copié :)");
		})
}

async function pushMenu(username, password) {
	var pushText = $("#in").val()

	_supabase.auth.signInWithPassword({ email: username, password: password }).then(signRes => {
		if (signRes.error) {
			alert(signRes.error);
		}
		else {
			_supabase.from('menu.menu').insert({ content: pushText }).then((insertRes) => {
				if (insertRes.error)
					alert(insertRes.error.message);
				else
					alert("Menu enregistré :)");
			})
		}
	})
}

async function updateOut(text) {
	var text1 = colorize(text);
	var text2 = text1.replace(/\n/g, "<br>");
	var text3 = text2.replace(/\t/g, "&#9;");
	$("#out").html(text3);
}

function colorize(text) {
	var res = "";
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i][0] == '#') {
			res += '<span class="styleCommented">' + lines[i] + "</span>";
		}
		else {
			var blocks = lines[i].split('_');
			for (var j = 0; j < blocks.length; j++) {
				var block = blocks[j];
				if (j > 5)  // There are 6 styles : from 0 to 5
					res += '<span class="styleError">' + block + "</span>";
				else
					res += '<span class="style' + j + '">' + block + "</span>";
				if (j < blocks.length - 1)
					res += '<span class="styleDelimiter">' + '_' + "</span>";
			}
		}
		if (i < lines.length - 1)
			res += '\n';
	}
	return res
}


function getDiffFragment(text1, text2) {
	fragment = document.createDocumentFragment();
	const diff = Diff.diffChars(text1, text2);

	diff.forEach((part) => {
		const backgroundColor = part.added ? 'green' :
			part.removed ? 'red' : 'transparent';
		const fontColor = part.added ? 'white' :
			part.removed ? 'white' : 'grey';
		const font_weight = part.added ? 'bold' :
			part.removed ? 'bold' : 'normal';
		span = document.createElement('span');
		span.style.backgroundColor = backgroundColor;
		span.style.color = fontColor;
		span.style.fontWeight = font_weight;
		// span.style.color = color;
		// span.style.fontWeight = font_weight;
		span.appendChild(document
			.createTextNode(part.value));
		fragment.appendChild(span);
	});
	return fragment;
}

function processButtonChild1() { //show diff
	let fragment = getDiffFragment(storedMenu, $("#in").val());

	document.getElementById('out').innerHTML = ""; 
	document.getElementById('out').appendChild(fragment);
	document.getElementById('diffButton').setAttribute('onclick', 'processButtonChild2()');
}

function processButtonChild2() { //show editor
	updateOut($("#in").val());
	document.getElementById('diffButton').setAttribute('onclick', 'processButtonChild1()');
}

async function resetMenu() {
	storedMenu = await getMenu()
	document.getElementById('in').innerHTML = storedMenu;
	updateOut($("#in").val());
}

function resetScroll() {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth",
	});
}

resetMenu()

// $("#in").on('scroll', function () {
// 	$("#out").css({ top: -$(this).scrollTop() + "px" });
// });

$("#in").on("keydown", function (e) {
	setTimeout(() => {
		updateOut($(this).val());
	}, 0)
})
