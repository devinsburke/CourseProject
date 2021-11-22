chrome.storage.sync.get(null, function(settings) {
	if (settings.show_icon.value && (settings.suppress_landing.value || document.location.pathname != '/'))
		document.body.appendChild(createTersePageElement(getSummaryEntries()));
});

chrome.runtime.onMessage.addListener((msg, _, response) => {
	if (msg.from === 'popup' && msg.subject === 'body')
		response({ 'element': createTersePageElement(getSummaryEntries()).outerHTML});
});