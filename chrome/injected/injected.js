var processor = getSummaryEntries();
document.body.appendChild(createTersePageElement(processor));

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if ((msg.from === 'popup') && (msg.subject === 'body')) {
		var x = JSON.stringify();
		console.log(createTersePageElement(processor));
		console.log(x);
		response({'element': createTersePageElement(processor).outerHTML});
	}
});

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

	var sp = document.createElement('span');
	sp.classList.add('material-icons-outlined');
	sp.innerHTML = 'Σ';
	container.appendChild(sp);

	var bg = document.createElement('terse-bg');
	container.appendChild(bg);
	var title = document.createElement('h1');
	title.innerHTML = document.title.split('-')[0].trim();
	container.appendChild(title);

	var topDocs = processor.getTopKDocuments();
	var originalWordCount = processor.documents.reduce((a,b) => a+b.words.length, 0);
	var summaryWordCount = topDocs.reduce((a,b) => a+b.words.length, 0);

	var insights = document.createElement('terse-insight-subtitle');
	insights.innerHTML = 'Terse reduced word count from ' + originalWordCount + ' to ' + summaryWordCount + ', reading time by ' + Math.round((originalWordCount - summaryWordCount)/200, 2) + ' minutes';
	container.appendChild(insights);

	var ul = document.createElement('ul');
	topDocs.forEach(doc => {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(doc.original));
		ul.appendChild(li);
	});
	container.appendChild(ul);

	return container;
	// document.body.appendChild(container);
}