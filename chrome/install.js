chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
        show_icon: {
            name: 'Show Terse icon on all pages',
            description: 'Controls visibility of the Terse summarization tool as a floating icon on all applicable pages.',
            type: 'boolean',
            value: true,
            sort_order: 1,
            configurable: true
        },

        suppress_landing: {
            name: 'Suppress on landing pages',
            description: 'If set, hide the Terse button on all website home pages (i.e. hidden on \'wikipedia.org\', but shown on \'wikipedia.org/article\')',
            type: 'boolean',
            value: true,
            sort_order: 2,
            configurable: true
        },

        summary_size: {
            name: 'Summary size',
            description: 'Determines the level of verbosity of the generated page summary.',
            type: 'slider',
            min: 1,
            max: 3,
            value: 2,
            sort_order: 3,
            configurable: true
        }
    });
});