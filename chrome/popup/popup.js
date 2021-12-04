document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tab => {
        chrome.tabs.sendMessage(
            tab[0].id,
            {
                from: 'popup',
                subject: 'body'
            },
            el => document.body.innerHTML = el
        );
    });
});