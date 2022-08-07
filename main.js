chrome.storage.sync.get(null, settings => {
	const node = document.createElement('tilder')
	node.classList.add('tilder-icon')
	document.body.appendChild(node)
	const view = new View(node)

	if (settings.show_icon.value) {
		const summary = extractPageSummary(settings)
		view.update(summary)
	}

	chrome.runtime.onMessage.addListener((data, _, callback) => {
		if (data == 'getElementContent') {
			const summary = extractPageSummary(settings)
			callback(summary)
			view.update(summary)
		}
	})
})

function extractPageSummary(settings) {
	const stopUrls = ['', '/', '/search', '/search/'] // TODO: Settings.
	const scraper = new TilderContentScraper()

	if (settings.suppress_landing.value && stopUrls.includes(document.location.pathname.toLowerCase()))
		return {
			success: false,
			message: 'Tilder is configured to ignore landing pages and search pages, as they are generally bad candidates for summarization. You may change this in the extension <i>Options</i>.',
		}
	
	const text = scraper.getContent(document.body)
	const content = new TilderSentencesDocumentProcessor(text, settings.summary_size.value / 20)
	if (text.length < 250 || content.documents.length < 12)
		return {
			success: false,
			message: 'This page is not a good candidate for summarization. Try longer pages such as news articles, blog posts, or encyclopdia entries.',
		}

	const topSentences = content.getTopKDocuments()
	return {
		success: true,
		title: scraper.getTitle(document),
		description: scraper.getDescription(document),
		topSentences: topSentences,
		topTopics: content.getTopKTopics(),
		originalWordCount: content.documents.reduce((a, b) => a + b.words.length, 0),
		summaryWordCount: topSentences.reduce((a, b) => a + b.words.length, 0),
	}
}