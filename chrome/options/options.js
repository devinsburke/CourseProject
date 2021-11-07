async function setValue(event) {
  var name = event.target.closest('label').getElementsByTagName('span')[0].innerHTML;
  var v = {};
  switch (event.target.type) {
    case 'checkbox': {
      v[name] = event.target.checked;
      break;
    }
    case 'range': {
      v[name] = event.target.value;
      break;
    }
  }
  chrome.storage.sync.set(v);
}

function getSettingElement(type, value) {
  switch (type.type) {
    case 'boolean': {
      var element = document.createElement('input');
      element.setAttribute('type', 'checkbox');
      if (value)
        element.setAttribute('checked', 'checked');
      element.addEventListener('click', function(event) {
        setValue(event);
      });
      return element;
    }
    case 'slider': {
      var element = document.createElement('slider');
      var input = document.createElement('input');
      input.setAttribute('type', 'range');
      input.setAttribute('min', type.min);
      input.setAttribute('max', type.max);
      input.setAttribute('value', value);
      input.classList.add('slider');
      input.addEventListener('change', function(event) {
        setValue(event);
      })
      element.appendChild(input);
      return element;
    }
  }
}

async function createSetting(setting) {
  var element = getSettingElement(setting, Object.values(await chrome.storage.sync.get(setting.name) ?? {})[0] ?? setting.defaultValue);
  
  var label = document.createElement('label');
  if (element != null)
    label.appendChild(element);
  var labelText = document.createElement('span');
  labelText.innerHTML = setting.name;
  label.appendChild(labelText);

  var description = document.createElement('span');
  description.innerHTML = setting.description;

  var container = document.createElement('li');
  container.appendChild(label);
  container.appendChild(description);

  return container;
}

function createMaterialIcon(iconString, href) {
  var icon = document.createElement('span');
  icon.classList.add('material-icons-outlined', 'icon');
  icon.innerHTML = iconString;
  if (href != null) {
    var ref = document.createElement('a');
    ref.setAttribute('href', href);
    ref.appendChild(icon);
    ref.setAttribute('target', '_blank');
    ref.setAttribute('rel', 'noopener noreferrer');
    return ref;
  }
  return icon;
}

function toggleTest(event) {
  var content = event.target.parentElement.parentElement.children[1];
  if (content.classList.contains('collapsed')) {
    content.classList.remove('collapsed');
    event.target.classList.remove('collapsed');
  }
  else {
    content.classList.add('collapsed');
    event.target.classList.add('collapsed');
  }
}

async function generateOptions() {
  var container = document.getElementById('options');
  terseSettings.forEach(async s => {
    var setting = await createSetting(s);
    container.appendChild(setting);
  });
}

function generateAbout() {
  var container = document.getElementById('about');
  terseAbout.forEach(a => {
    var elem = document.createElement('li');
    elem.innerHTML = a;
    container.appendChild(elem);
  })
}

function generateTests() {
  var container = document.getElementById('tests');
  terseTests.forEach(t => {
    var elem = document.createElement('li');
    var header = document.createElement('div');
    header.classList.add('test-heading');

    var expansion = createMaterialIcon('chevron_right');
    expansion.classList.add('collapsed');
    expansion.addEventListener('click', function(event) {
      toggleTest(event);
    });
    header.appendChild(expansion);

    var title = document.createElement('span');
    title.innerHTML = t.name;
    header.appendChild(title);

    var headerIcon = createMaterialIcon('open_in_new', t.url);
    header.appendChild(headerIcon);
    elem.appendChild(header);

    var results = document.createElement('div');
    results.classList.add('test-results');
    results.innerHTML = 'RESULTS GO HERE';
    header.appendChild(results);

    var content = document.createElement('div');
    content.classList.add('test-content', 'collapsed');
    
    var table = document.createElement('table');
    var body = document.createElement('tbody');
    var head = document.createElement('tr');
    var head1 = document.createElement('th');
    head1.innerHTML = 'Sentence';
    var head2 = document.createElement('th');
    head2.innerHTML = 'Score';
    var head3 = document.createElement('th');
    head3.innerHTML = 'Retrieved';
    head.appendChild(head1);
    head.appendChild(head2);
    head.appendChild(head3);
    body.appendChild(head);

    t.sentences.forEach(s => {
      var row = document.createElement('tr');
      var cellSentence = document.createElement('td');
      cellSentence.innerHTML = s.sentence;

      var cellScore = document.createElement('td');
      cellScore.innerHTML = s.score;

      var cellRetrieved = document.createElement('td');
      cellRetrieved.innerHTML = ''; // TODO: 

      row.appendChild(cellSentence);
      row.appendChild(cellScore);
      row.appendChild(cellRetrieved);
      body.appendChild(row);
    });

    table.appendChild(body);
    content.appendChild(table);
    elem.appendChild(content);

    container.appendChild(elem);
  });
}

generateOptions();
generateAbout();
generateTests();