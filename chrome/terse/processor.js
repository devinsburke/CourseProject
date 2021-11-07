function getSummaryEntries() {
	var scraper = new TerseContentScraper();
	var text = scraper.getContent(document.body.cloneNode(true));
	if (text.length < 250)
		return new TerseSentencesDocumentProcessor('', 0);
	var processor = new TerseSentencesDocumentProcessor(text, 0.1);
	if (processor.documents.length < 12)
		processor.documents = [];
	return processor;
}

function createTersePageElement(processor) {
	var topDocs = processor.getTopKDocuments();
	var originalWordCount = processor.documents.reduce((a,b) => a+b.words.length, 0);
	var summaryWordCount = topDocs.reduce((a,b) => a+b.words.length, 0);
    if (summaryWordCount == 0) {
        var invalidElement = document.createElement('terse-invalid-page');
        if (document.location.pathname == '/')
            invalidElement.innerHTML = 'Terse is currently configured to not summarize landing pages. You may adjust this in the extension\'s <i>Options</i>.';
        else
            invalidElement.innerHTML = 'There wasn\'t enough content on this page to justify summarizing it.';
        return invalidElement;
    }

	var container = document.createElement('terse');
	container.id = 'terse-icon';

    var meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Type');
    meta.setAttribute('content', 'text/html; charset=UTF-8');
    container.appendChild(meta);

	var sp = document.createElement('terse-span');
	sp.classList.add('material-icons-outlined');
	sp.innerHTML = 'Σ';
	container.appendChild(sp);

	var bg = document.createElement('terse-bg');
	container.appendChild(bg);
	var title = document.createElement('terse-h1');
	title.innerHTML = document.title.split(' - ')[0].trim();
	container.appendChild(title);

	var insights = document.createElement('terse-insight-subtitle');
	insights.innerHTML = 'Terse reduced word count from ' + originalWordCount + ' to ' + summaryWordCount + ', reading time by ' + Math.round((originalWordCount - summaryWordCount)/200, 2) + ' minutes';
	container.appendChild(insights);

	var ul = document.createElement('terse-ul');
	topDocs.forEach(doc => {
		var li = document.createElement('terse-li');
		li.appendChild(document.createTextNode(doc.original));
		ul.appendChild(li);
	});
	container.appendChild(ul);

	return container;
}