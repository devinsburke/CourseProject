const displaySetting = 'Show Terse button on all pages';
const suppressSetting = 'Suppress on landing pages';

var processor = getSummaryEntries();
chrome.storage.sync.get(displaySetting, function(setting) {
	if (Object.values(setting ?? {'': terseSettings.find(t => t.name == displaySetting).defaultValue})[0])
		chrome.storage.sync.get(suppressSetting, function(suppression) {
			if (document.location.pathname != '/')
				document.body.appendChild(createTersePageElement(processor));
			else if (!(Object.values(suppression ?? {'': terseSettings.find(t => t.name == suppressSetting).defaultValue})[0]))
				document.body.appendChild(createTersePageElement(processor));
		});
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
	if ((msg.from === 'popup') && (msg.subject === 'body')) {
		response({'element': createTersePageElement(processor).outerHTML});
	}
});