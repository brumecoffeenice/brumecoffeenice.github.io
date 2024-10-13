const elementPercentInViewport = function (el) {
	let
		rect = el.getBoundingClientRect(),
		windowHeight = (window.innerHeight || document.documentElement.clientHeight);

	return (
		Math.min(
			Math.max(Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)), 0),
			Math.max(Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100))
		)
	)
};

function heartAnimation() {
	var reviewBoxContainer = document.getElementById("reviewBoxContainer");
	var heart = document.getElementById("heart");

	if (elementPercentInViewport(reviewBoxContainer) > 50) {
		heart.classList.add('animate');
	}
	if (elementPercentInViewport(reviewBoxContainer) < 10) {
		heart.classList.remove('animate');
	}
}
