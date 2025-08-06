const input = document.getElementById("gloss-input");
const transcription_output = document.getElementById("transcription-result");

let editor = CodeMirror.fromTextArea(input, {
  lineNumbers: false,
  lineWrapping: true,
  autoCloseBrackets: {
    'pairs': '(){}'
  },
});

function copy() {
  navigator.clipboard.writeText(editor.getValue());
}

let key = undefined;
function share(el) {
  el.disabled = true;
  const body = { value: editor.getValue(), key:key };
  fetch(`https://rosidb.netlify.app/.netlify/functions/kv`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(r => r.json())
    .then(text => {
      key = text;
      document.getElementById('share-link').innerHTML = `<a href="${window.location.href}#${key}">${key}</a>`;
      el.disabled = false;
    })
}

const FMT_RE = /(\([^()]*\)\d?)/g
const ABBR_RE = /\{([A-Z0-9.>-]+)(?:\:([^}]+))?\}/g



function fmt(text,tag='span') {
  const pieces = text.split(FMT_RE);
  const cell = document.createElement(tag);

  for (let j = 0; j < pieces.length; j++) {
    let text = pieces[j];
    let class_ = '';
    if (text.match(FMT_RE)) {
      const c= text[text.length-1];
      if (c==')') {
        text = text.slice(1, -1);
      } else {
        class_ = 'hl'+c
        text = text.slice(1, -2);
      }
    }
    let span = document.createElement("span");
    span.innerHTML = text
      .replaceAll('<','&lt;')
      .replaceAll('\n','<br>')
      .replaceAll('\uf701', '(')
      .replaceAll('\uf702', ')')
      .replaceAll('&null;', '∅')
      .replaceAll(ABBR_RE, (m, tag, title) => `<abbr title="${title ?? abrev(tag)}">${tag}</abbr>`)
    if (class_) span.classList.add(class_);
    cell.appendChild(span);
  }

  return cell;
}

function translate(message, outerContainer) {
  message = message.replaceAll('((', '\uf701').replaceAll('))', '\uf702');
  let rows = message.split("\n").filter((row) => row.length > 0);

  let container = document.createElement("div");

  rows = rows.map(s => s.replaceAll(ABBR_RE, (m) => m.replaceAll(' ','\2')))
  rows = rows.map(s => s.replaceAll(FMT_RE, (m) => m.replaceAll(' ','\2')))

  let lines = rows.map(s => s.trim().replaceAll('__','\u00a0').split(/[ \t]+/))

  let rest_ = null;

  if (lines && lines[0] && lines[0][0].trim() == "#") {
    const h2 = document.createElement("h2");
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    h2.appendChild(fmt(text));
    h2.style.marginBottom = '1em';
    h2.style.marginTop = '1em';
    outerContainer.appendChild(h2);
    lines = lines.slice(1);
  }

  let m;
  if (lines && lines[0] && (m = lines[0][0].trim().match(/^\(\d+\)/))) {
    container = document.createElement("li");
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ')
    const el = fmt(text, 'p');
    el.style.marginBottom = '0.8em';
    el.style.marginTop = '10px';
    container.appendChild(el);
    lines = lines.slice(1);
  }

  while (lines && lines[0] && lines[0][0].trim() == "!") {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ')
    const el = fmt(text, 'p');
    el.style.marginBottom = '0.8em';
    el.style.marginTop = '10px';
    container.appendChild(el);
    lines = lines.slice(1);
  }


  let italic = lines.map(l => l[0]=='*');
  lines.forEach((l,i) => {if (italic[i]) l.shift()})

  const table = document.createElement("div");
  table.style.display = 'flex';
  table.style.flexWrap = 'wrap';

  let lmin = lines.findIndex(l => l[0] == '>');
  if (lmin != -1) {
    lines[lmin] = lines[lmin].slice(1);
    rest_ = lines.slice(lmin).map(s=>s.join(' ').replaceAll('\2',' ')).join('\n');
    lines = lines.slice(0, lmin);
  } else {
    lmin = lines.length;
  }

  const min = Math.max(...lines.map(s=>s.length));

  for (var j = 0; j < min; j++) {
    let tr = document.createElement("div");
    tr.style.display = 'flex';
    tr.style.flexDirection = 'column';
    tr.style.marginBottom = '0.5em';
    tr.style.marginRight = '1.0em';
    for (let i = 0; i < lmin; i++) {
      const col = lines[i][j] ?? '\u00a0';
      let td = document.createElement("span");
      if (italic[i]) td.style.fontStyle = 'italic';

      td.appendChild(fmt(col.replaceAll('\2',' ')))
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.appendChild(table);

  if (rest_) {
    const rest = document.createElement("p");
    rest.style.marginBlockStart = '0em';
    rest.appendChild(fmt(rest_));
    container.appendChild(rest)
  }

  container.style.marginBottom = '1em';

  return container
}

const none = document.createTextNode("...");
function update() {
  const value = editor.getValue()
  if (value.trim() == '') {
    transcription_output.replaceChildren(none);
    return;
  }
  const container = document.createElement('ol');
  value.split(/\n--+\n/).forEach(v => {
    const k = translate(v, container);
    container.appendChild(k);
  });
  transcription_output.replaceChildren(container);
}

editor.on('change', update);
