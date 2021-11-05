var processor = getSummaryEntries();
document.body.appendChild(createTersePageElement(processor));

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if ((msg.from === 'popup') && (msg.subject === 'body')) {
		var x = JSON.stringify();
		console.log(createTersePageElement(processor));
		console.log(x);
		response({'element': createTersePageElement(processor).outerHTML});
	}
});