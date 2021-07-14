const isNode = (checkElement) => {
	let check = typeof checkElement;
	return check == 'object' ? true : false
}

const nodeToArr = (arrNode) => {
  let newArr = [];
  for (let i = 0; i < arrNode.length; i++) {
    newArr[i] = arrNode[i];
  }
  return newArr
}

export { nodeToArr, isNode };