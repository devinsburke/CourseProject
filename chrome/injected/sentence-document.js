const rIgnoreChars = /((?<=[\w])\.(?=[\w]))|((?<=\b[\w])\.(?=[\W]))|((?<=\s)\.(?=[\w]))/g;
const rRemoveChars = /(((?<=\b[\w])\.\s(?=[\w]\.))|((?<=\b[\w]\.\s[\w])\.(?=\s)))|(((?<=\b[\w]{2,})\.\s(?=[\w]\.))|((?<=\b[\w]{2,}\.\s[\w])\.(?=\s)))/g;
const rSplitChars = /(?<=[\w])\.+(?=[\w])/g;
const rSentenceTerminators = /[.!?]+/g;

const ignorePlaceholder = '\uFBB3';
const removePlaceholder = '\uFBB3\u202F';

const defaultStopwords = ['i','me','my','myself','we','our','ours','ourselves','you','you\'re','you\'ve','you\'ll','you\'d','your','yours','yourself','yourselves','he','him','his','himself','she','she\'s','her','hers','herself','it','it\'s','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','that\'ll','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','don\'t','should','should\'ve','now','d','ll','m','o','re','ve','y','ain','aren','aren\'t','couldn','couldn\'t','didn','didn\'t','doesn','doesn\'t','hadn','hadn\'t','hasn','hasn\'t','haven','haven\'t','isn','isn\'t','ma','mightn','mightn\'t','mustn','mustn\'t','needn','needn\'t','shan','shan\'t','shouldn','shouldn\'t','wasn','wasn\'t','weren','weren\'t','won','won\'t','wouldn','wouldn\'t',''];

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
	constructor(text, topPercent=0.1, stopwords=defaultStopwords) {
		this.text = text;
		this.stopwords = stopwords;
		this.documents = [];
		this.topPercent = topPercent;
		this.nlp = new TerseNaturalLanguageProcessor(this.stopwords);
		this.documents = this.splitSentencesAsDocuments(text);
	}
	
	splitSentencesAsDocuments(text) {
		var docs = this.substitutePlaceholders(text)
			.replace(rSplitChars, ' ')
			.replace('\n', ' . ')
			.split(rSentenceTerminators)
			.filter(n => n);
		var lists = docs.map(d => this.nlp.toWords(this.removePlaceholders(d.toLowerCase())));
		var bags = lists.map(s => this.nlp.toBagOfWords(s, true));
		var scores = this.nlp.getSimilarityScores(true, ...bags);
		
		return docs.map((s,i) => new TerseSentenceDocument(
			this.reversePlaceholders(s),
			lists[i],
			bags[i],
			scores[i],
			i
		));
	}
	
	substitutePlaceholders(text) {
		return text.replace(rRemoveChars, removePlaceholder).replace(rIgnoreChars, ignorePlaceholder);
	}
	
	removePlaceholders(text) {
		return text.replace(removePlaceholder, '').replace(ignorePlaceholder, '');
	}
	
	reversePlaceholders(text) {
		return text.replace(removePlaceholder, '. ').replace(ignorePlaceholder, '.');
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