const format = (data, config) => {

	function getID(id) {
		let getID = id.match(/post-\d{1,}/g)[0];
		return getID.replace('post-', '');
	}

	function getLink(link) {
		let getLink = link,
			result = "";
		
		for (var i = 0; i < getLink.length; i++) {
			if (getLink[i].rel == 'alternate') {
				result = getLink[i].href;
			}
		}

		return result;
	}

	function cleanHTML (html) {
		return html.replace(/<[^>]*>?/g, '')
	}

	function summary (content) {
		return config.summary ? cleanHTML(content).substr(0, config.summary) : cleanHTML(content).substr(0, 100)
	}

	function getThumbnail (content) {
		let temp = document.createElement('div');
		temp.innerHTML=content;

		let getImage = temp.querySelector('img');

		return getImage ? getImage.getAttribute('src') : "";
	}

	const content = data.content ? data.content.$t : data.summary.$t;
	
	return {
		id: getID(data.id.$t),
		title: data.title ? data.title.$t : 'No title',
		thumbnail: data.media$thumbnail ? data.media$thumbnail.url.replace(/s\B\d{2,4}-c/, config.img ? config.img : 's200') : getThumbnail,
		label: data.category ? data.category.map(el=>el.term) : '',
		link: getLink(data.link),
		content: content,
		summary: summary(content),
		published: data.published.$t,
		update: data.updated.$t
	}
}

export { format }