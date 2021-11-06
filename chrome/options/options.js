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

generateOptions();
generateAbout();