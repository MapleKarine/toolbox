function translateMarkdown(message) {

  function strip(text) {
    return text
      .replaceAll('\uf701', '(')
      .replaceAll('\uf702', ')')
      .replaceAll('&null;', 'Ø')
      .replaceAll(/\(([^()]*)\)\d?/g, (m, tag) => `${tag}`)
      .replaceAll(ABBR_RE, (m, tag, title) => `${tag}`)
      .replaceAll(SUB_RE, (m, tag) => `${tag}`)
      .replaceAll('&low;', '__')
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "")
  }

  function fmtPre(text) {
    const pieces = text.split(FMT_RE);
    let cell = document.createElement('span');

    for (let j = 0; j < pieces.length; j++) {
      let text = pieces[j];
      let class_ = '';
      if (text.match(FMT_RE)) {
        const c= text[text.length-1];
        if (c==')') {
          text = text.slice(1, -1);
        } else {
          text = text.slice(1, -2);
        }
      }
      let span = document.createElement("span");
      span.innerHTML = text
        .replaceAll('\uf701', '(')
        .replaceAll('\uf702', ')')
        .replaceAll('&null;', 'Ø')
        .replaceAll('&low;', '__')
        .replaceAll(ABBR_RE, (m, tag, title) => `${tag}`)
        .replaceAll(SUB_RE, (m, tag) => `${tag}`)
      cell.appendChild(span);
    }

    return cell;
  }

  function fmtMd(text) {
    const pieces = text.split(FMT_RE);
    let cell = document.createElement('span');

    for (let j = 0; j < pieces.length; j++) {
      let text = pieces[j];
      let class_ = '';
      if (text.match(FMT_RE)) {
        const c= text[text.length-1];
        if (c==')') {
          text = text.slice(1, -1);
        } else {
          text = text.slice(1, -2);
        }
        class_ = 'hl'
      }
      let span = document.createElement("span");
      span.innerHTML = text
        .replaceAll('\uf701', '(')
        .replaceAll('\uf702', ')')
        .replaceAll('&null;', '∅')
        .replaceAll('&low;', '＿')
        .replaceAll(ABBR_RE, (m, tag, title) => `<span style='font-size: 0px;'>__</span><span style='text-decoration: underline;'>${tag}</span><span style='font-size: 0px;'>__</span>`)
        .replaceAll(SUB_RE, (m, tag) => `${tag}`)
      if (class_) { ansi(cell, '**'); span.style.fontWeight = 'bold' }
      cell.appendChild(span);
      if (class_) { ansi(cell, '**') }
    }

    return cell;
  }

  function ansi(container,code) {
    const el = document.createElement('span');
    el.innerText = code;
    el.style.fontSize = '0px';
    container.appendChild(el);
  }

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
    ansi(h2, '## ');
    h2.appendChild(fmtMd(text));
    container.appendChild(h2);
    lines = lines.slice(1);
  }

  let m;
  if (lines && lines[0] && (m = lines[0][0].trim().match(/^\(\d+\)/))) {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    const el = fmtMd(text, 'span');
    container.appendChild(el);
    lines = lines.slice(1);
  }

  while (lines && lines[0] && lines[0][0].trim() == "!") {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    const el = fmtMd(text, 'span');
    container.appendChild(el);
    lines = lines.slice(1);
  }

  let italic = lines.map(l => l[0]=='*');
  lines.forEach((l,i) => {if (italic[i]) l.shift()})
  

  let lmin = lines.findIndex(l => l[0] == '>');
  if (lmin != -1) {
    lines[lmin] = lines[lmin].slice(1);
    rest_ = lines.slice(lmin).map(s=>s.join(' ').replaceAll('\2',' ')).join('\n');
    lines = lines.slice(0, lmin);
  } else {
    lmin = lines.length;
  }

  const min = Math.max(...lines.map(s=>s.length));

  // const groups = [];
  let j = 0;
  // let k = 0;
  for (j = 0; j < min; j++) {
    let maxl = 0;
    for (let i = 0; i < lmin; i++) {
      lines[i][j] = lines[i][j] ?? '\u00a0'
      const len = strip(lines[i][j]).length
      if (len > maxl) maxl = len;
    }

    for (let i = 0; i < lmin; i++) {
      const len = strip(lines[i][j]).length
      const dif = lines[i][j].length-len;
      lines[i][j] = lines[i][j].padEnd(maxl+dif, ' ');
    }

    // if (k + maxl >= 32) {
    //   k = 0;
    //   groups.push(j)
    // }
    // k += maxl;
  }

  // groups.push(j)


  container.appendChild(document.createElement("br"))
  for (let i = 0; i < lmin; i++) {
    const pre = document.createElement('code');
    pre.style.whiteSpace = 'pre'
    for (let j = 0; j < min; j++) {
      const col = lines[i][j];
      const text = fmtPre(col.replaceAll('\2',' ')+(j != min-1 ? ' ' : ''));
      pre.appendChild(text);
    }
    ansi(container, '`');
    container.appendChild(pre);
    ansi(container, '`');
    container.appendChild(document.createElement("br"))
  }
  // container.appendChild(document.createElement("br"))

  // if (lines.length) {
    
  // }

  if (rest_) {
    const rest = document.createElement("span");
    // rest.style.marginBlockStart = '0em';
    rest.appendChild(fmt(rest_));
    container.appendChild(rest)
  }

  container.style.marginBottom = '1em';

  return container
}

function renderMarkdown(value) {
  const container = document.createElement('ol');
  value.split(/\n--+\n/).forEach(v => {
    const k = translateMarkdown(v);
    container.appendChild(k);
    // container.appendChild(document.createElement("br"))
  });

  return container
}