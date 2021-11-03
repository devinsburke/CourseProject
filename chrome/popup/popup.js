let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

function callback(obj) {
  console.log(obj);
  document.body.innerHTML = obj.element;
}

changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    {from: 'popup', subject: 'body'},
    callback
  );
});