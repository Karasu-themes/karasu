const parser = (json, html) => {
	return html.replace(/\{\w+\}/g, value=>{
		let objName = value.replace(/{|}/g, '');
		return json[objName];
	})
}

export { parser }