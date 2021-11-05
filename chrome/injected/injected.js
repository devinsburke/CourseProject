var processor = getSummaryEntries();
document.body.appendChild(createTersePageElement(processor));

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if ((msg.from === 'popup') && (msg.subject === 'body')) {
		response({'element': createTersePageElement(processor).outerHTML});
	}
});