const terseSettings = [
    {
      'name': 'Show Terse button on all pages', 
      'description': 'Controls visibility of the Terse summarization tool as a floating button on all applicable pages.',
      'type': 'boolean',
      'defaultValue': true
    },
    {
      'name': 'Suppress on landing pages',
      'description': 'If set, hide the Terse button on all website home pages (i.e. hidden on \'wikipedia.org\', but shown on \'wikipedia.org/article\')',
      'type': 'boolean',
      'defaultValue': true
    },
    {
      'name': 'Summary size',
      'description': 'Determines the level of verbosity of the generated page summary.',
      'type': 'slider',
      'min': 1,
      'max': 3,
      'defaultValue': 2
    }
  ];

const terseAbout = [
    'Terse is an intelligent browsing extension that summarizes any text-based web page you visit. It will pull the most relevant/descriptive sentences from the page and display those as a bulleted summary. The number of sentences shown will vary depending on the length of the document and applicable settings above. Terse aims for efficient comprehension of a page with minimal time investment, by performing text retrieval using various algorithms and natural language processing techniques.',
    'Algorithms and methods utilized include utilization of the vector-space model using bag-of-words representation of each sentence a page. A similarity matrix using dot-matrix is implemented as well, and cosine similarity between each sentence is measured based on the weight of overlapping words. In order to implement the benefit of IDF, Terse utilizes a stop-word collection to minimize the impact of common words.'
]

const terseTests = [
    {
        'url': '',
        'originalText': '',
        'userRelevance': [

        ],
        'terseRelevance': [
            
        ]
    }
]