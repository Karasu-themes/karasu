const createScript = (homeURL, attributes) => {

	let scrpt = document.createElement('script');
	scrpt.src = `${homeURL}/feeds/posts/${attributes}`;

	return scrpt;

}

export { createScript }