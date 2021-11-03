function callback(obj) {
  console.log(obj);
  document.body.innerHTML = obj.element;
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

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.tabs.sendMessage(
//     tab.id,
//     {from: 'popup', subject: 'body'},
//     callback
//   );
// });