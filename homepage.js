function scrollShowMenu() {
	document.getElementById("scrollTarget").scrollIntoView({ behavior: "smooth" });
	showMenu();
}

function getValueFromScroll(scroll, maxScroll, startValue, endValue) {
	//interpolate
	value = startValue + (endValue - startValue) * scroll / maxScroll;
	//to get value always between start and end whatever signs
	//comparison function has to be given
	return ([startValue, value, endValue].sort(function (a, b) { return a - b; })[1])
}

function scrollTransform(scroll) {
	// {	//Brightening of wallpaper
	// 	let startValue = 100;
	// 	let endValue = 70;
	// 	let maxScroll = 500;
	// 	let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
	// 	document.getElementById('backgroundBrume').style.opacity = value + "%";
	// }
	{	//Translation of wallpaper
		let startValue = 0;
		let endValue = 100;
		let maxScroll = 5000;
		let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
		document.getElementById('backgroundBrume').style.bottom = value + "vh";
	}
	// {
	// 	//Reduce logo
	// 	let startValue = 100;
	// 	let endValue = 0;
	// 	let maxScroll = 300;
	// 	let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
	// 	document.getElementById('brumeR').style.scale = value + "%";
	// }
	// {
	// 	//Reduce logo
	// 	let startValue = 300;
	// 	let endValue = 0;
	// 	let maxScroll = 300;
	// 	let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
	// 	document.getElementById('brumeLogo').style.height = value + "px";
	// 	document.getElementById('brumeLogo').style.width = value + "px";
	// }
	{
		//Opacity of logo and circle
		let startValue = 100;
		let endValue = 0;
		let maxScroll = 300;
		let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
		document.getElementById('brumeR').style.opacity = value + "%";
		document.getElementById('circle').style.opacity = value + "%";
	}
	{
		//Opacity of halo
		let startValue = 0;
		let endValue = 100;
		let maxScroll = 300;
		let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
		document.getElementById('halo1').style.opacity = 100 - value + "%";
		document.getElementById('halo2').style.opacity = value + "%";
	}
	{
		//Size of circle
		let startValue = 300;
		let endValue = 800;
		let maxScroll = 300;
		let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
		document.getElementById('circle').style.width = value + "px";
	}
	// {
	// 	//Size of halo
	// 	let startValue = 40;
	// 	let endValue = 40;
	// 	let maxScroll = 300;
	// 	let value = getValueFromScroll(scroll, maxScroll, startValue, endValue);
	// 	document.getElementById('brumeHalo').style.backgroundImage = 'radial-gradient(circle, #ffffff00, #ffffffd3 ' + value + '%, #ffffffc1 60%, #8adaffd8 90%)';
	// }
}

window.addEventListener('scroll', () => {
	scrollTransform(window.scrollY);
});

scrollTransform(0);