function getSummaryEntries() {
	if (!this.summaryEntries) {
		var scraper = new TerseContentScraper();
		var text = scraper.getContent(document.body);
		if (text.length < 250)
			return new TerseSentencesDocumentProcessor('', 0);
		this.summaryEntries = new TerseSentencesDocumentProcessor(text, 0.1);
		if (this.summaryEntries.documents.length < 12)
			this.summaryEntries.documents = [];
	}
	return this.summaryEntries;
}

function createTersePageElement(processor) {
	if (!this.tersePageElement) {
		var topDocs = processor.getTopKDocuments();
		var topTopics = processor.getTopLTopics();

		var originalWordCount = processor.documents.reduce((a, b) => a + b.words.length, 0);
		var summaryWordCount = topDocs.reduce((a, b) => a + b.words.length, 0);
		if (summaryWordCount == 0) {
			var invalidElement = document.createElement('terse-invalid-page');
			if (document.location.pathname == '/')
				invalidElement.innerHTML = 'Terse is currently configured to not summarize landing pages. You may adjust this in the extension\'s <i>Options</i>.';
			else
				invalidElement.innerHTML = 'There wasn\'t enough content on this page to justify summarizing it.';
			return invalidElement;
		}

		this.tersePageElement = document.createElement('terse');
		this.tersePageElement.id = 'terse-icon';

		var meta = document.createElement('meta');
		meta.setAttribute('http-equiv', 'Content-Type');
		meta.setAttribute('content', 'text/html; charset=UTF-8');
		this.tersePageElement.appendChild(meta);

		var sp = document.createElement('terse-span');
		sp.classList.add('material-icons-outlined');
		sp.innerHTML = 'Σ';
		this.tersePageElement.appendChild(sp);

		var bg = document.createElement('terse-bg');
		this.tersePageElement.appendChild(bg);
		var title = document.createElement('terse-h1');
		title.innerHTML = document.title.split(' - ')[0].trim();
		this.tersePageElement.appendChild(title);

		var insights = document.createElement('terse-insight-subtitle');
		insights.innerHTML = 'Reduced wordcount from ' + originalWordCount + ' to ' + summaryWordCount + ', reading time by ' + Math.round((originalWordCount - summaryWordCount) / 200, 2) + ' minutes';
		this.tersePageElement.appendChild(insights);

		var topicTitle = document.createElement('terse-h2');
		topicTitle.innerHTML = 'Key Phrases / Topics';
		this.tersePageElement.appendChild(topicTitle);
		var topicUl = document.createElement('terse-topic-ul');
		for (const [topic, topicObj] of topTopics) {
			var li = document.createElement('terse-li');
			li.setAttribute('data-count', topicObj.count);
			li.appendChild(document.createTextNode(topic));
			topicUl.appendChild(li);
		}
		this.tersePageElement.appendChild(topicUl);

		var sentenceTitle = document.createElement('terse-h2');
		sentenceTitle.innerHTML = 'Key Sentences';
		this.tersePageElement.appendChild(sentenceTitle);
		var sentenceUl = document.createElement('terse-ul');
		topDocs.forEach(doc => {
			var li = document.createElement('terse-li');
			li.appendChild(document.createTextNode(doc.original));
			sentenceUl.appendChild(li);
		});
		this.tersePageElement.appendChild(sentenceUl);
	}
	return this.tersePageElement;
}