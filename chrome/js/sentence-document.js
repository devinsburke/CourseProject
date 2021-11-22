const defaultStopwords = ['i','me','my','myself','we','our','ours','ourselves','you','you\'re','you\'ve','you\'ll','you\'d','your','yours','yourself','yourselves','he','him','his','himself','she','she\'s','her','hers','herself','it','it\'s','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','that\'ll','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','don\'t','should','should\'ve','now','d','ll','m','o','re','ve','y','ain','aren','aren\'t','couldn','couldn\'t','didn','didn\'t','doesn','doesn\'t','hadn','hadn\'t','hasn','hasn\'t','haven','haven\'t','isn','isn\'t','ma','mightn','mightn\'t','mustn','mustn\'t','needn','needn\'t','shan','shan\'t','shouldn','shouldn\'t','wasn','wasn\'t','weren','weren\'t','won','won\'t','wouldn','wouldn\'t','www','com'];
const defaultAbbreviations = ['abr','apr','aug','ave','cir','ct','dec','dr','ed','etc','et al','feb','gen','inc','jan','jr','jul','jun','ln','mar','mr','mrs','nov','oct','pp','prof','rep','rd','rev','sen','sep','sr','st','vol','vs'];

class TerseSentenceDocument {
	constructor(original, words, vocabulary, score, sortOrder) {
		this.original = original;
		this.words = words;
		this.vocabulary = vocabulary;
		this.score = score;
		this.sortOrder = sortOrder;
	}
}

class TerseSentencesDocumentProcessor {
	constructor(text, topPercent=0.1, stopwords=defaultStopwords, abbreviations=defaultAbbreviations) {
		this.text = text;
		this.stopwords = stopwords;
		this.abbreviations = abbreviations;
		this.documents = [];
		this.topPercent = topPercent;
		this.nlp = new TerseNaturalLanguageProcessor(this.stopwords);
		this.terminators = {
			sentence: new RegExp('(?:[\\!\\?\\r\\n]+[\"\']?)|(?:(?<!\\b(?:' + this.abbreviations.join('|') + '|[a-z]))\\.+(?![\\w\\.\\!\\?])[\"\']?)', 'gi'),
			word: new RegExp('(?:^\\[.*\\])|(?:[^a-z\\.\\s]+)|(?:(?<!\\b[a-z])\\.)|(?:(?<!\\b[a-z]\\.)\\s)|(?:\\s(?![a-z]\\.))', 'gi'),
		};
		if (text)
			this.documents = this.splitSentencesAsDocuments(text);
	}

	splitSentencesAsDocuments(text) {
		text = text
			.replace('."', '".')
			.replace('.\'', '\'.')
			.replace('?"', '"?')
			.replace('?\'', '\'?')
			.replace('!"', '"!')
			.replace('!\'', '\'!');
		var docs = text.split(this.terminators.sentence).map(s => s && s.trim()).filter(n => n);
		return this.processSentencesDocuments(docs);
	}

	processSentencesDocuments(documents) {
		var lists = documents.map(d => d.toLowerCase().split(this.terminators.word).map(w => w && w.trim()).filter(w => w));
		var bags = lists.map(s => this.nlp.toBagOfWords(s, true));
		var scores = this.nlp.getSimilarityScores(false, ...bags);
		this.documents = documents.map((s, i) => new TerseSentenceDocument(s, lists[i], bags[i], scores[i], i));
		return this.documents;
    }

	getTopKValue() {
		return Math.ceil(this.topPercent * this.documents.length);
	}

	getTopKDocuments() {
		return this.documents
			.sort((a,b) => b.score-a.score)
			.slice(0, this.getTopKValue())
			.sort((a,b) => a.sortOrder-b.sortOrder);
	}
}
