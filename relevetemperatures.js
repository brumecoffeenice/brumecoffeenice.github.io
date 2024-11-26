const SupabaseUrl = "https://cpvxjedlgjhcdqjyecmf.supabase.co"
const SupabasePublicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnhqZWRsZ2poY2RxanllY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjMzMzYsImV4cCI6MjAxNDgzOTMzNn0.Rs-bqvUb0Eq7NEKX3tFc8WHJOjzk1Rc4fgRRU6OtVNs"
const _supabase = supabase.createClient(SupabaseUrl, SupabasePublicAnonKey)

var g_allowFreezer = false;


function showTemperatures(datas) {
	var container = document.getElementById('mainTable');
	container.innerHTML = "";

	var header = document.createElement('tr');
	container.appendChild(header);

	if (g_allowFreezer) {

		header.innerHTML = `
		<th>date</th>
		<th>frigo 1 (°C)</th>
		<th>frigo 2 (°C)</th>
		<th>congel (°C)</th>
		<th>matin / soir</th>
		<th>operateur</th>
		`
	} else {
		header.innerHTML = `
			<th>date</th>
			<th>frigo 1 (°C)</th>
			<th>frigo 2 (°C)</th>
			<th>matin / soir</th>
			<th>operateur</th>
	`}

	for (let data of datas) {
		var row = document.createElement('tr');
		container.appendChild(row);

		dateStr = (new Date(data.date)).toLocaleDateString();
		if (!(dateStr[0] >= '0' && dateStr[0] <= '9'))
			dateStr = "";

		var date = document.createElement('td');
		var frigo1 = document.createElement('td');
		var frigo2 = document.createElement('td');
		var congel = document.createElement('td');
		var hour = document.createElement('td');
		var operator = document.createElement('td');

		date.textContent = dateStr;
		frigo1.textContent = data.frigo1;
		frigo2.textContent = data.frigo2;
		congel.textContent = data.congel;
		hour.textContent = data.hour;
		operator.textContent = data.operator;

		row.appendChild(date);
		row.appendChild(frigo1);
		row.appendChild(frigo2);
		if (g_allowFreezer)
			row.appendChild(congel);
		row.appendChild(hour);
		row.appendChild(operator);
	}
}

async function fetchTemperatures(username, password) {
	_supabase.auth.signInWithPassword({ email: username, password: password })
		.then(signRes => {
			if (signRes.error) {
				alert(signRes.error);
			} else {
				_supabase
					.from('temperatures')
					.select()
					.limit(10000)
					.order("date", { ascending: false })
					.then((res) => {
						if (res.error) {
							alert(res.error.message);
						} else {
							showTemperatures(res.data);
						}
					})
			}
		})
}

async function pushTemperatures(username, password, frigo1, frigo2, congel, hour, operator, date) {

	_supabase.auth.signInWithPassword({ email: username, password: password }).then(signRes => {
		if (signRes.error) {
			alert(signRes.error);
		}
		else {
			const d = new Date();
			let dateStr = d.toDateString();
			if (date !== "")
				dateStr = date;

			_supabase.from('temperatures').insert({
				frigo1: frigo1,
				frigo2: frigo2,
				congel: congel,
				hour: hour,
				operator: operator,
				date: dateStr
			}).then((insertRes) => {
				if (insertRes.error)
					alert(insertRes.error.message);
				else
					alert("Relevé enregistré :)");
			})
		}
		fetchTemperatures(emailBox.value, passwordBox.value);
	})
}

loadButton.addEventListener('click', function () {
	fetchTemperatures(emailBox.value, passwordBox.value);
})

pushButton.addEventListener('click', function () {
	pushTemperatures(emailBox.value, passwordBox.value, frigo1Box.value, frigo2Box.value, congelBox.value, hourBox.value, operatorBox.value, dateBox.value);
})

function printContent() {
	const printWindow = window.open('', '', 'width=800,height=600');
	printWindow.document.write(`
    <html>
    <head>
        <title>relevé de températures</title>
        <link id="printStylesheet" rel="stylesheet" href="relevetemperatures.css">
    </head>
    <body>
        <table id='printTable'>
    </body>
    </html>
`);
	printWindow.document.getElementById('printTable').innerHTML = document.getElementById('mainTable').innerHTML;
	printWindow.document.close();

	// function myprint() {
	printWindow.print();
	printWindow.onafterprint = () => printWindow.close();
	// }
	// setTimeout(myprint, 100)
}

function allowFreezer() {
	g_allowFreezer = !g_allowFreezer;

	if (g_allowFreezer) {
		document.getElementById("congelContainer").style.display = "";
	} else {
		document.getElementById("congelContainer").style.display = "none";
	}

	fetchTemperatures(emailBox.value, passwordBox.value);
}