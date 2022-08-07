document.addEventListener('DOMContentLoaded', async() => {
    let counter = 0
    const tab = await chrome.tabs.query({ active: true, currentWindow: true })
    const fn = _ => chrome.tabs.sendMessage(tab[0].id, 'getElementContent', el => {
        if (el || counter > 5)
            document.body.innerHTML = el || 'The page took too long to load. Please try again.'
        else
            setTimeout(fn, 100 * counter++)
    })
    fn()
})
