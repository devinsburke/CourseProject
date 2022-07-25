chrome.storage.sync.get(null, function (settings) {
	chrome.runtime.onMessage.addListener((msg, _, response) => {
		if (msg.from === 'popup' && msg.subject === 'body')
			response(createTilderPageElement(settings.summary_size.value, settings.suppress_landing.value).outerHTML);
	});

	if (settings.show_icon.value) {
		var element = createTilderPageElement(settings.summary_size.value, settings.suppress_landing.value);
		element.classList.add('tilder-icon');
		document.body.appendChild(element);
	}
})

function createTilderPageElement(summarySizeOptionValue, suppressLanding) {
	if (suppressLanding && ['', '/', '/search', '/search/'].includes(document.location.pathname.toLowerCase())) {
		var invalidElement = document.createElement('tilder-invalid-page');
		invalidElement.innerHTML = 'Tilder is configured to ignore landing pages and search pages, as they are generally bad candidates for summarization. You may change this in the extension\'s <i>Options</i>.';
		return invalidElement;
	}

	var scraper = new TilderContentScraper();
	var text = scraper.getContent(document.body);
	var entries = new TilderSentencesDocumentProcessor(text, summarySizeOptionValue / 20);
	if (text.length < 250 || entries.documents.length < 12) {
		var invalidElement = document.createElement('tilder-invalid-page');
		invalidElement.innerHTML = 'This page isn\'t a good candidate for summarization. Try longer pages such as news articles, blog posts, or encyclopdia entries.';
		return invalidElement;
	}
	var title = scraper.getTitle(document);
	var description = scraper.getDescription(document);

	var topDocs = entries.getTopKDocuments();
	var topTopics = entries.getTopKTopics();

	var originalWordCount = entries.documents.reduce((a, b) => a + b.words.length, 0);
	var summaryWordCount = topDocs.reduce((a, b) => a + b.words.length, 0);
	var element = document.createElement('tilder');

	var meta = document.createElement('meta');
	meta.setAttribute('http-equiv', 'Content-Type');
	meta.setAttribute('content', 'text/html; charset=UTF-8');
	element.appendChild(meta);

	var sp = document.createElement('tilder-span');
	sp.innerHTML = 'Σ';
	element.appendChild(sp);

	var bg = document.createElement('tilder-bg');
	element.appendChild(bg);
	var h1 = document.createElement('tilder-h1');
	h1.innerHTML = title;
	element.appendChild(h1);

	var insights = document.createElement('tilder-insight-subtitle');
	insights.innerHTML = 'Summarized a ' + originalWordCount + ' word document in ' + summaryWordCount + ' words, cutting read time by ' + Math.round((originalWordCount - summaryWordCount) / 200, 2) + ' minutes';
	element.appendChild(insights);

	if (description) {
		var descriptionTitle = document.createElement('tilder-h2');
		descriptionTitle.innerHTML = 'Official Description';
		element.appendChild(descriptionTitle);

		var descriptionEl = document.createElement('tilder-description');
		descriptionEl.innerHTML = description;
		element.appendChild(descriptionEl);
	}

	var topicTitle = document.createElement('tilder-h2');
	topicTitle.innerHTML = 'Topics (Word Clusters)';
	topicTitle.setAttribute('data-count', topTopics.length);
	element.appendChild(topicTitle);
	var topicUl = document.createElement('tilder-topic-ul');
	for (const [topic, topicObj] of topTopics) {
		var li = document.createElement('tilder-li');
		li.setAttribute('data-count', topicObj.count);
		li.appendChild(document.createTextNode(topic));
		topicUl.appendChild(li);
	}
	element.appendChild(topicUl);

	var sentenceTitle = document.createElement('tilder-h2');
	sentenceTitle.innerHTML = 'Summary (Key Sentences)';
	sentenceTitle.setAttribute('data-count', topDocs.length);
	element.appendChild(sentenceTitle);
	var sentenceUl = document.createElement('tilder-ul');
	topDocs.forEach(doc => {
		var li = document.createElement('tilder-li');
		li.appendChild(document.createTextNode(doc.original));
		sentenceUl.appendChild(li);
	});
	element.appendChild(sentenceUl);
	return element;
}