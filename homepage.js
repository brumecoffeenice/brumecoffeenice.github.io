function clamp(val, min, max) {
	return val > max ? max : val < min ? min : val;
}

function scrollShowMenu() {
	document.getElementById("scrollTarget").scrollIntoView({ behavior: "smooth" });
	showMenu();
}

function transformBackground(scroll) {
	{	//Brightening of wallpaper
		let startValue = 90;
		let endValue = 0;
		let maxScroll = 800;
		let value = startValue + (endValue - startValue) * scroll / maxScroll;
		let limitedValue = clamp(value, endValue, startValue);
		document.getElementById('backgroundBrume').style.opacity = limitedValue + "%";
	}
	{	//Translation of wallpaper
		let startValue = 0;
		let endValue = 100;
		let maxScroll = 1600;
		let value = startValue + (endValue - startValue) * scroll / maxScroll;
		let limitedValue = clamp(value, startValue, endValue);
		document.getElementById('backgroundBrume').style.top = - limitedValue + "%";
	}
	{
		//Reduce logo
		let startValue = 100;
		let endValue = 0;
		let maxScroll = 300;
		let value = startValue + (endValue - startValue) * scroll / maxScroll;
		let limitedValue = clamp(value, endValue, startValue);
		document.getElementById('brumeR').style.scale = limitedValue + "%";
	}
	{
		//Opacity of logo and circle
		let startValue = 100;
		let endValue = 0;
		let maxScroll = 300;
		let value = startValue + (endValue - startValue) * scroll / maxScroll;
		let limitedValue = clamp(value, endValue, startValue);
		document.getElementById('brumeR').style.opacity = limitedValue + "%";
		document.getElementById('circle').style.opacity = limitedValue + "%";
	}
	{
		//Size of circle
		let startValue = 90;
		let endValue = 200;
		let maxScroll = 300;
		let value = startValue + (endValue - startValue) * scroll / maxScroll;
		let limitedValue = clamp(value, startValue, endValue);
		document.getElementById('circle').style.width = limitedValue + "vw";
		document.getElementById('circle').style.height = limitedValue + "vw";
	}
}

window.addEventListener('scroll', () => {
	transformBackground(window.scrollY);
});

transformBackground(0);