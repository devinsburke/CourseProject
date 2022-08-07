class View {
	constructor(node) {
		this.node = node

		const meta = this.#create('meta')
		meta.setAttribute('http-equiv', 'Content-Type')
		meta.setAttribute('content', 'text/html charset=UTF-8')

		this.#create('tilder-span', {text: 'Σ'})
		this.#create('tilder-bg')
		this.#create('tilder-h1', {id: 'tilder-title'})
		this.#create('tilder-insight-subtitle', {id: 'tilder-subtitle'})
		this.#create('tilder-h2', {text: 'Official Description'})
		this.#create('tilder-description', {id: 'tilder-description'})
		this.#create('tilder-h2', {id: 'tilder-topic-title', text: 'Topics (Word Clusters)'})
		this.#create('tilder-topic-ul', {id: 'tilder-topic-list'})
		this.#create('tilder-h2', {id: 'tilder-sentence-title', text: 'Summary (Key Sentences)'})
		this.#create('tilder-ul', {id: 'tilder-sentence-list'})
	}

	#create(tag, attr = {}) {
		const el = document.createElement(tag)
		this.node.appendChild(el)
		if (attr.id)
			el.id = attr.id
		if (attr.text)
			el.innerText = attr.text
		return el
	}

	update(data) {
		document.getElementById('tilder-title').innerText = data.title
		document.getElementById('tilder-subtitle').innerText = 'Summarized a ' + data.originalWordCount + ' word document in ' + data.summaryWordCount + ' words, cutting read time by ' + Math.round((data.originalWordCount - data.summaryWordCount) / 200, 2) + ' minutes'
		document.getElementById('tilder-description').innerText = data.description
		
		document.getElementById('tilder-topic-title').setAttribute('data-count', data.topTopics.length)
		const topicList = document.getElementById('tilder-topic-list')
		topicList.innerHTML = ''
		for (const [topic, {count}] of data.topTopics) {
			const li = document.createElement('tilder-li')
			li.setAttribute('data-count', count)
			li.innerText = topic
			topicList.appendChild(li)
		}

		document.getElementById('tilder-sentence-title').setAttribute('data-count', data.topSentences.length)
		const sentenceList = document.getElementById('tilder-sentence-list')
		sentenceList.innerHTML = ''
		for (const doc of data.topSentences) {
			const li = document.createElement('tilder-li')
			li.innerText = doc.original
			sentenceList.appendChild(li)
		}
	}
}
