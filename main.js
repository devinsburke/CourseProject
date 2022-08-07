chrome.storage.sync.get(null, function (settings) {
	chrome.runtime.onMessage.addListener((msg, _, response) => {
		if (msg.from === 'popup' && msg.subject === 'body')
			response(createTilderPageElement(settings.summary_size.value, settings.suppress_landing.value).outerHTML)
	})

	if (settings.show_icon.value) {
		const element = createTilderPageElement(settings.summary_size.value, settings.suppress_landing.value)
		element.classList.add('tilder-icon')
		document.body.appendChild(element)
	}
})

function createTilderPageElement(summarySizeOptionValue, suppressLanding) {
	if (suppressLanding && ['', '/', '/search', '/search/'].includes(document.location.pathname.toLowerCase())) {
		const invalidElement = document.createElement('tilder-invalid-page')
		invalidElement.innerHTML = 'Tilder is configured to ignore landing pages and search pages, as they are generally bad candidates for summarization. You may change this in the extension\'s <i>Options</i>.'
		return invalidElement
	}

	const scraper = new TilderContentScraper()
	const text = scraper.getContent(document.body)
	const entries = new TilderSentencesDocumentProcessor(text, summarySizeOptionValue / 20)
	if (text.length < 250 || entries.documents.length < 12) {
		const invalidElement = document.createElement('tilder-invalid-page')
		invalidElement.innerHTML = 'This page isn\'t a good candidate for summarization. Try longer pages such as news articles, blog posts, or encyclopdia entries.'
		return invalidElement
	}
	const title = scraper.getTitle(document)
	const description = scraper.getDescription(document)

	const topDocs = entries.getTopKDocuments()
	const topTopics = entries.getTopKTopics()

	const originalWordCount = entries.documents.reduce((a, b) => a + b.words.length, 0)
	const summaryWordCount = topDocs.reduce((a, b) => a + b.words.length, 0)
	const element = document.createElement('tilder')

	const meta = document.createElement('meta')
	meta.setAttribute('http-equiv', 'Content-Type')
	meta.setAttribute('content', 'text/html charset=UTF-8')
	element.appendChild(meta)

	const sp = document.createElement('tilder-span')
	sp.innerHTML = 'Σ'
	element.appendChild(sp)

	const bg = document.createElement('tilder-bg')
	element.appendChild(bg)
	const h1 = document.createElement('tilder-h1')
	h1.innerHTML = title
	element.appendChild(h1)

	const insights = document.createElement('tilder-insight-subtitle')
	insights.innerHTML = 'Summarized a ' + originalWordCount + ' word document in ' + summaryWordCount + ' words, cutting read time by ' + Math.round((originalWordCount - summaryWordCount) / 200, 2) + ' minutes'
	element.appendChild(insights)

	if (description) {
		const descriptionTitle = document.createElement('tilder-h2')
		descriptionTitle.innerHTML = 'Official Description'
		element.appendChild(descriptionTitle)

		const descriptionEl = document.createElement('tilder-description')
		descriptionEl.innerHTML = description
		element.appendChild(descriptionEl)
	}

	const topicTitle = document.createElement('tilder-h2')
	topicTitle.innerHTML = 'Topics (Word Clusters)'
	topicTitle.setAttribute('data-count', topTopics.length)
	element.appendChild(topicTitle)
	const topicUl = document.createElement('tilder-topic-ul')
	for (const [topic, topicObj] of topTopics) {
		const li = document.createElement('tilder-li')
		li.setAttribute('data-count', topicObj.count)
		li.appendChild(document.createTextNode(topic))
		topicUl.appendChild(li)
	}
	element.appendChild(topicUl)

	const sentenceTitle = document.createElement('tilder-h2')
	sentenceTitle.innerHTML = 'Summary (Key Sentences)'
	sentenceTitle.setAttribute('data-count', topDocs.length)
	element.appendChild(sentenceTitle)
	const sentenceUl = document.createElement('tilder-ul')
	topDocs.forEach(doc => {
		const li = document.createElement('tilder-li')
		li.appendChild(document.createTextNode(doc.original))
		sentenceUl.appendChild(li)
	})
	element.appendChild(sentenceUl)
	return element
}