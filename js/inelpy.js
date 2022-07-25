class InelpySentence {
    #rawText
    #words
    #index
    #vocabulary
	constructor(text, index, config) {
        this.#rawText = text
        this.text = () => this.#rawText
        this.#index = index
        this.index = () => this.#index
        this.#config = config
	}

    words() {
        if (!this.#words) {
            this.#words = []
            const words = this.#rawText.split(this.terminators.word)
            const len = words.length
            for (let i = 0; i < len; ++i) {
                let sentence = words[i]
                if (sentence)
                    sentence = sentence.trim()
                if (sentence)
                    this.#words.push(new InelpySentence(sentence, i, this.#config))
            }
        }
        return this.#words
    }
    
    bagOfWords() {
        if (!this.#vocabulary) {
            //
        }
        return this.#vocabulary
    }
}

class InelpyDocument {
    #rawText
    #sentences
    #clusters
    #config

    constructor(text, config) {
        this.#rawText = text
        this.text = () => this.#rawText
        this.#config = config
    }

    sentences() {
        if (!this.#sentences) {
            this.#sentences = []
            const sentences = this.#rawText
                 // TODO: Don't hard code these.
                .replace(`."`, `".`).replace(`.'`, `'.`).replace(`?"`, `"?`)
                .replace(`?'`, `'?`).replace(`!"`, `"!`).replace(`!'`, `'!`)
                .split(this.terminators.sentence)

            const len = sentences.length
            for (let i = 0; i < len; ++i) {
                let sentence = sentences[i]
                if (sentence)
                    sentence = sentence.trim()
                if (sentence)
                    this.#sentences.push(new InelpySentence(sentence, i, this.#config))
            }
        }
        return this.#sentences
    }

    clusters() {
        if (!this.#clusters) {
            this.#clusters = new Map()
            for (let list of nestedList) {
                const cluster = []
                for (const w of list) {
                    if (cluster.length == this.config.maxClusterSize)
                        cluster.shift()
                    cluster.push(w)
                    for (let i = 0, l = cluster.length; i < l - 1; i++) {
                        const asArray = cluster.slice(i, l)
                        const str = asArray.join(' ')
                        const value = this.#clusters.get(str) ?? { asArray: asArray, score: 0, count: 0, }
                        value.count += 1
                        value.score += 1 + 0.1 * (l - i)
                        this.#clusters.set(str, value)
                    }
                }
            }

            // TODO: De-complexify.
            this.#clusters = new Map([...this.#clusters.entries()]
                .filter(([_, t]) => t.score > this.config.minClusterScore && topics.every(([__, t2]) => t2.score <= t.score || t2.asArray.length < t.asArray.length || !t.asArray.every(w => t2.asArray.includes(w))))
                .sort((a, b) => b[0].length - a[0].length)
                .sort((a, b) => b[1].score - a[1].score)
            )
        }
        return this.#clusters
    }
}

class Inelpy {
	constructor(config) {
		this.setConfig(config)
	}

    setConfig({abbreviations, maxClusterSize, minClusterScore, stopwords, topPercent}) {
        const abbr = abbreviations || this.config.abbreviations || defaultAbbreviations
        this.config = {
            abbreviations: abbr,
            maxClusterSize: maxClusterSize || 4,
            minClusterScore: minClusterScore || 3,
            stopwords: stopwords || this.config.stopwords || defaultStopwords,
            topPercent: topPercent || this.config.topPercent || 0.1,
            terminators: {
                sentence: new RegExp('(?:[\\!\\?\\r\\n]+[\"\']?)|(?:(?<!\\b(?:' + this.abbreviations.join('|') + '|[a-z]))\\.+(?![\\w\\.\\!\\?])[\"\']?)', 'gi'),
                word: new RegExp('(?:^\\[.*\\])|(?:[^a-z\\.\\s]+)|(?:(?<!\\b[a-z])\\.)|(?:(?<!\\b[a-z]\\.)\\s)|(?:\\s(?![a-z]\\.))', 'gi'),
            }
        }
    }
}