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

  const settings = {
    // centralLowVowel: false,
    // layout: 'trapezoid',
    size: 40,
    // labialized: true,
    // nasalTop: true,
    // sibilant: false,
    ...udata,
  };
  const segments = parse(value,settings,(msg) => {
    const x = document.createElement('p');
    x.innerHTML = `<span>${msg}</span>`
    container.appendChild(x)
  })

  output.innerHTML = 
    renderConsonants(segments.filter(x=>!x.vowel),settings)+
    renderVowels(segments.filter(x=>x.vowel),settings);
  container.appendChild(output);

  return container
}

const renderingOptions = {
  'html': renderHTML,
  // 'markdown': renderMarkdown,
  // 'discord-fancy': renderDiscordFancy,
}
let renderingOption = 'html';


const none = document.createTextNode("...");
function update() {
  if (renderingOption===null) return

  const value = editor.getValue()
  if (value.trim() == '') {
    transcription_output.replaceChildren(none);
    return;
  }
  const container = renderingOptions['html'](value)
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