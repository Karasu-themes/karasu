export const isNode = (checkElement) => {
	let check = typeof checkElement;
	return check == 'object' ? true : false
}
