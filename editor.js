//Public DB access
const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

document.addEventListener("DOMContentLoaded", getLastMenu)
lastMenu = "";

async function getLastMenu() {
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

async function initMenu() {
	let menuFile = await getLastMenu();
	menuFile = menuFile.replace(/(\r\n)/gm, "\n"); //set \n as delimiter by replacing \r\n
	menuFile = menuFile.replace(/(\r)/gm, "\n"); //set \n as delimiter by replacing \r
	document.getElementById('in').innerHTML = menuFile;
	lastMenu = menuFile;
	updateScreen(menuFile);
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
	const { data, error0 } = await _supabase.auth.signInWithPassword({
		email: username,
		password: password,
	});
	console.log(error0);

	var pushText = $("#in").val()

	const { error1 } = await _supabase
		.from('menu.menu')
		.insert({ content: pushText })
	console.log(error1);
}

pushButton.addEventListener('click', function () {
	pushMenu(email.value, password.value);
})

initMenu()

updateScreen($("#in").val());
$("#in").on("keydown", function (e) {
	setTimeout(() => {
		updateScreen($(this).val());
	}, 0)
})
async function updateScreen(text) {
	var text1 = await colorize(text);
	var text2 = await text1.replace(/\n/g, "<br>");
	var text3 = await text2.replace(/\t/g, "&#9;");
	$("#out").html(text3);
}
$("#in").on('scroll', function () {
	// set out to be the same as in
	$("#out").css({ top: -$(this).scrollTop() + "px" });
});
function colorize(text) {
	var res = "";
	var colors = [
		`<span style="color:lightBlue; font-weight:bold">`,
		`<span style="color:lightBlue; font-weight:bold; font-style: italic;">`,
		`<span style="color:peru; font-weight:bold">`,
		`<span style="color:peru; font-weight:bold; font-style: italic;">`,
		`<span style="color:Khaki">`,
		`<span style="color:Khaki; font-style: italic;">`,
		`<span style="color:lightCoral">`,
		`<span style="color:red; font-weight:bold">`,
		`<span style="color:grey">`,
		`<span style="color:grey; font-style: italic;">`,
		`<span style="color:darkSeaGreen">`,
		`<span style="color:darkSeaGreen; font-style: italic;">`];
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i][0] == '/' && lines[i][1] == '/') {
			res += `<span style="color:black">` + lines[i] + "</span>";
		}
		else {
			blocks = lines[i].split('_');
			for (var j = 0; j < blocks.length; j++) {
				var block = blocks[j];
				//block = block.padEnd(10, ' ').slice(0, 10);
				if (j >= colors.length)
					res += `<span style="color:red; font-weight:bold">` + block + "</span>";
				else
					res += colors[j] + block + "</span>";
				if (j < blocks.length - 1)
					res += `<span style="color:dimGrey">` + '_' + "</span>";
			}
		}
		if (i < lines.length - 1)
			res += '\n';
	}
	return res
}


function getDiff() {

	const text1 = lastMenu;
	const text2 = $("#in").val();

	res = "";

	display = document.getElementById('out');
	display.innerHTML = "";
	fragment = document.createDocumentFragment();

	const diff = Diff.diffChars(text1, text2);

	diff.forEach((part) => {
		const color = part.added ? 'green' :
			part.removed ? 'red' : 'grey';
		const font_weight = part.added ? 'bold' :
			part.removed ? 'bold' : 'normal';
		span = document.createElement('span');
		span.style.color = color;
		span.style.fontWeight = font_weight;
		span.appendChild(document
			.createTextNode(part.value));
		fragment.appendChild(span);
	});
	display.appendChild(fragment);
}
