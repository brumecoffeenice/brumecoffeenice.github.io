const elementPercentInViewport = function (el) {
	let
		rect = el.getBoundingClientRect(),
		windowHeight = (window.innerHeight || document.documentElement.clientHeight);

	return (
		Math.min(
			Math.max(Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)), 0),
			Math.max(Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100), 0)
		)
	)
};

function heartAnimation() {
	var reviewBoxContainer = document.getElementById("reviewBoxContainer");
	var heart = document.getElementById("heart");

	var visibleRatio = elementPercentInViewport(reviewBoxContainer);
	if (visibleRatio > 0) {
		heart.classList.add('animate');
	}
	if (visibleRatio == 0) {
		heart.classList.remove('animate');
	}
}
