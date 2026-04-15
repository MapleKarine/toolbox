function translateObsidian(message) {

  function fmtPre(text) {
    const pieces = text.split(FMT_RE);
    let cell = document.createElement('span');

    cell.innerText = text
      .replaceAll('[', `^[`)
      .replaceAll(']', `^]`)
      .replaceAll(/\(([^()]*)\)\d?/g, (m, tag) => `[${tag}]`)
      .replaceAll('\uf701', '(')
      .replaceAll('\uf702', ')')
      .replaceAll('&null;', '∅')
      .replaceAll('&low;', '＿')
      .replaceAll(ABBR_RE, (m, tag, title) => `${tag}`)
      .replaceAll(SUB_RE, (m, tag) => `${tag}`)
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "")

    return cell;
  }

  message = message.replaceAll('((', '\uf701').replaceAll('))', '\uf702');
  let rows = message.split("\n").filter((row) => row.length > 0);

  let container = document.createElement("pre");
  
  rows = rows.map(s => s.replaceAll(ABBR_RE, (m) => m.replaceAll(' ','\2')))
  rows = rows.map(s => s.replaceAll(FMT_RE, (m) => m.replaceAll(' ','\2')))

  let lines = rows.map(s => s.trim().replaceAll('__','\u00a0').split(/[ \t]+/))

  let rest_ = null;

  if (lines && lines[0] && lines[0][0].trim() == "#") {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    container.appendChild(fmtPre('\\lbl '+text+'\n'));
    lines = lines.slice(1);
  }

  let m;
  if (lines && lines[0] && (m = lines[0][0].trim().match(/^\((\d+)\)/))) {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    container.prepend(`\\num ${m[1]}\n`);
    container.appendChild(fmtPre('\\ex '+text+'\n', 'span'));
    lines = lines.slice(1);
  }

  while (lines && lines[0] && lines[0][0].trim() == "!") {
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    container.appendChild(fmtPre('\\ex '+text+'\n', 'span'));
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

  let j = 0;
  for (j = 0; j < min; j++) {
    let maxl = 0;
    for (let i = 0; i < lmin; i++) {
      lines[i][j] = lines[i][j] ?? '\u00a0'
      const len = fmtPre(lines[i][j]).length
      if (len > maxl) maxl = len;
    }

    for (let i = 0; i < lmin; i++) {
      const len = fmtPre(lines[i][j]).length
      const dif = lines[i][j].length-len;
      lines[i][j] = lines[i][j].padEnd(maxl+dif, ' ');
    }
  }

  for (let i = 0; i < lmin; i++) {
    container.append(`\\gl${['a','b','c'][i]??'c'} `);

    for (let j = 0; j < min; j++) {
      const col = lines[i][j];
      const text = fmtPre(col.replaceAll('\2',' ')+(j != min-1 ? ' ' : ''));
      container.appendChild(text);
    }

    container.append('\n');
  }

  if (rest_) {
    const rest = document.createElement("span");
    rest.appendChild(fmtPre('\\ft '+rest_.replaceAll(/^['"]|['"]$/g, '')));
    container.appendChild(rest)
  }

  container.prepend('```gloss\n');
  container.append('\n```\n');

  return container;
}

function renderObsidian(value) {
  const container = document.createElement('div');
  container.style.marginBottom = '1rem'
  value.split(/\n--+\n/).forEach((v,i,a) => {
    const k = translateObsidian(v);
    container.appendChild(k);
  });

  return container
}