function callback(obj) {
    document.body.innerHTML = obj.element;
    if (obj.element.split('>')[0].split('<')[1] == 'terse-invalid-page') {
        document.body.classList.add('invalid');
        document.classList.add('invalid');
    }
    else
        document.getElementsByTagName('terse-bg')[0].setAttribute('data-display', 'Σ');
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tab => {
        chrome.tabs.sendMessage(
            tab[0].id,
            { from: 'popup', subject: 'body' },
            callback
        );
    });
});