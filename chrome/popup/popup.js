function callback(obj) {
  console.log(obj);
  document.body.innerHTML = obj.element;
  document.getElementsByTagName('terse-bg')[0].setAttribute('content-after', 'Σ');
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }).then(tab => {
    console.log(tab[0]);
    chrome.tabs.sendMessage(
      tab[0].id,
      {from: 'popup', subject: 'body'},
      callback
    );
  });
});