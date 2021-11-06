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