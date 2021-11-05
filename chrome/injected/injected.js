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
	var topDocs = processor.getTopKDocuments();
	topDocs.forEach(doc => {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(doc.original));
		ul.appendChild(li);
	});
	container.appendChild(ul);
	
	var originalWordCount = processor.documents.reduce((a,b) => a+b.words.length, 0);
	var summaryWordCount = topDocs.reduce((a,b) => a+b.words.length, 0);
	// Do stuff.
	
	document.body.appendChild(container);
}