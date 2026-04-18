const input = document.getElementById("gloss-input");
const transcription_output = document.getElementById("transcription-result");

let editor = CodeMirror.fromTextArea(input, {
  lineNumbers: false,
  lineWrapping: true,
  theme: 'maple-dark',
  autoCloseBrackets: {
    'pairs': '(){}'
  },
});

function copy() {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(transcription_output);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
}

function renderHTML(value) {
  const container = document.createElement('div');
  const output = document.createElement('div');
  output.classList.add('horizontal')
  output.classList.add('wrap')
  output.classList.add('align-center')

  const settings = {
    size: 40,
    ...udata,
  };
  const segments = parse(value,settings,(msg) => {
    const x = document.createElement('p');
    x.innerHTML = `<span>${msg}</span>`
    container.appendChild(x)
  })

  if (settings.title) {
    const title = document.createElement('h3');
    title.innerText = settings.title;
    container.appendChild(title);
  }

  output.innerHTML = 
    renderConsonants(segments.filter(x=>!x.vowel),settings)+
    renderVowels(segments.filter(x=>x.vowel),settings);
  container.appendChild(output);

  return container
}

const none = document.createTextNode("...");
function update() {
  const value = editor.getValue();
  if (value.trim() == '') {
    transcription_output.replaceChildren(none);
    return;
  }
  const container = renderHTML(value);
  transcription_output.replaceChildren(container);

  sessionStorage.setItem("ipa-chart-session-input", value);
}

function loadSession() {
  const value = sessionStorage.getItem("ipa-chart-session-input");
  if (value) editor.setValue(value)
}

editor.on('change', update);



const udata = {};

const models = document.querySelectorAll("[u-model]");
for (const m of models) {
  const type = m.getAttribute('type');
  if (type === 'radio') {
    const expr = m.getAttribute('u-model')
    if (Object.hasOwn(udata, expr)) continue;

    const group = [...document.querySelectorAll(`[u-model="${expr}"]`)];
    
    Object.defineProperty(udata, expr, {
      get() { return group.find(x => x.checked)?.value; },
      set(v) { 
        const x = group.find(x => x.value == v);
        if (x) x.checked = true; },
      enumerable: true,
    })

  } else if (type === 'checkbox') {
    Object.defineProperty(udata, m.getAttribute('u-model'), {
      get() { return m.checked; },
      set(v) { m.checked = v; },
      enumerable: true,
    })
  } else {
    Object.defineProperty(udata, m.getAttribute('u-model'), {
      get() { return m.value; },
      set(v) { m.value = v; },
      enumerable: true,
    })
  }


}