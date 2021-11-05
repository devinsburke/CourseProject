let settings = [
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
    'options': [3,2,1],
    'defaultValue': 2
  }
];

function getValue(settingName, defaultValue) {
  return chrome.storage.sync.get(settingName) ?? defaultValue;
}

function getSettingElement(type, value) {
  switch (type) {
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
      type.options.forEach(o => {
        var opt = document.createElement('option');
        if (o == value)
          opt.classList.add('selected');
        opt.addEventListener('click', function(event) {
          setValue(event);
        });
        element.appendChild(opt);
      });
      return element;
    }
  }
}

function createSetting(setting) {
  var element = getSettingElement(setting, getValue(setting.name, setting.defaultValue));
  
  var label = document.createElement('label');
  label.innerHTML = setting.name;
  if (element != null)
    label.appendChild(element);

  var description = document.createElement('span');
  description.innerHTML = setting.description;

  var container = document.createElement('li');
  container.appendChild(label);
  container.appendChild(description);
  return container;
}

function generateOptions() {
  var container = document.getElementById('options');
  settings.forEach(s => {
    container.appendChild(createSetting(s));
  });
}

generateOptions();



// let page = document.getElementById("buttonDiv");
// let selectedClassName = "current";
// const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// // Reacts to a button click by marking the selected button and saving
// // the selection
// function handleButtonClick(event) {
//   // Remove styling from the previously selected color
//   let current = event.target.parentElement.querySelector(
//     `.${selectedClassName}`
//   );
//   if (current && current !== event.target) {
//     current.classList.remove(selectedClassName);
//   }

//   // Mark the button as selected
//   let color = event.target.dataset.color;
//   event.target.classList.add(selectedClassName);
//   chrome.storage.sync.set({ color });
// }

// // Add a button to the page for each supplied color
// function constructOptions(buttonColors) {
//   chrome.storage.sync.get("color", (data) => {
//     let currentColor = data.color;
//     // For each color we were provided…
//     for (let buttonColor of buttonColors) {
//       // …create a button with that color…
//       let button = document.createElement("button");
//       button.dataset.color = buttonColor;
//       button.style.backgroundColor = buttonColor;

//       // …mark the currently selected color…
//       if (buttonColor === currentColor) {
//         button.classList.add(selectedClassName);
//       }

//       // …and register a listener for when that button is clicked
//       button.addEventListener("click", handleButtonClick);
//       page.appendChild(button);
//     }
//   });
// }

// // Initialize the page by constructing the color options
// constructOptions(presetButtonColors);