var processor = getSummaryEntries();
createTersePageElement(processor);

function getSummaryEntries() {
	var scraper = new TerseContentScraper();
	var text = scraper.getContent(document.body.cloneNode(true));
	if (text.length < 250)
		return null;

	var processor = new TerseSentencesDocumentProcessor(text, 0.1);
	if (processor.documents.length < 12)
		return null;
	return processor;
}

function createTersePageElement(processor) {
	var container = document.createElement('terse');
	container.id = 'terse-icon';

	var title = document.createElement('h1');
	title.innerHTML = 'Page Summary';
	container.appendChild(title);

	var ul = document.createElement('ul');
	processor.getTopKDocuments().forEach(doc => {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(doc.original));
		ul.appendChild(li);
	});
	container.appendChild(ul);

	document.body.appendChild(container);
}