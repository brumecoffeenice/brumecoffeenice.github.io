function scrollShowMenu() {
	document.getElementById("scrollTarget").scrollIntoView({ behavior: "smooth" });
	showMenu();
}

document.querySelector('.parallax').addEventListener('scroll', function () {
	console.log(this.scrollTop);
	if (this.scrollTop > 10) {
		for (let element of document.getElementsByClassName('fadeoutplz')) {
			element.classList.remove('fadein');
			element.classList.add('fadeout');
		}
		for (let element of document.getElementsByClassName('fadeinplz')) {
			element.classList.remove('fadeout');
			element.classList.add('fadein');
		}
		for (let element of document.getElementsByClassName('scaleupplz')) {
			element.classList.remove('fadein');
			element.classList.add('scaleup');
		}
	}
	if (this.scrollTop == 0) {
		for (let element of document.getElementsByClassName('fadeoutplz')) {
			element.classList.remove('fadeout');
			element.classList.add('fadein');
		}
		for (let element of document.getElementsByClassName('fadeinplz')) {
			element.classList.remove('fadein');
			element.classList.add('fadeout');
		}
		for (let element of document.getElementsByClassName('scaleupplz')) {
			element.classList.remove('scaleup');
			element.classList.add('fadein');
		}
	}

});


//triggeraddClass(classname, trigger, "add")



