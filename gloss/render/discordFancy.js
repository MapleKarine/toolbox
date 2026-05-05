function translateDiscordFancy(message, outerContainer, settings) {

  const discordColors = [
    '#ffffff',
    '#dc322f',
    '#268bd2',
    '#859900',
    '#b58900',
    '#d33682',
    '#2aa198',
    '#4f545c',
    'var(--fg-color)',
  ]

  const discordColorsEscape = [
    '[0;38m',
    '[0;31m',
    '[0;34m',
    '[0;32m',
    '[0;33m',
    '[0;35m',
    '[0;36m',
    '[0;37m',
    '[0;0m',
  ]

  const highlightColor = discordColors[settings.discordObjColor]??'#d33682';
  const metaColor = discordColors[settings.discordMetaColor]??'var(--fg-color)';
  const highlightEscape = discordColorsEscape[settings.discordObjColor]??'[0;35m';
  const metaEscape = discordColorsEscape[settings.discordMetaColor]??'[0;0m';

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

  function fmtPre(text, color) {
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
        class_ = c;
      }
      let span = document.createElement("span");
      span.innerHTML = text
        .replaceAll('<', '&lt;')
        .replaceAll('\uf701', '(')
        .replaceAll('\uf702', ')')
        .replaceAll('&null;', 'Ø')
        .replaceAll('&low;', '__')
        .replaceAll(ABBR_RE, (m, tag, title) => `<span style='font-size: 0px;'>[4m</span><span style='text-decoration: underline;'>${tag}</span><span style='font-size: 0px;'>${color}</span>`)
        .replaceAll(SUB_RE, (m, tag) => `${tag}`)
      cell.appendChild(span);
      if (class_) {
        span.innerHTML = `<span style='font-size: 0px;'>${discordColorsEscape[+class_]??color}</span>`+
            `<span style='color: ${discordColors[+class_]??'var(--fg-color)'};'>${span.innerHTML}</span>`+
            `<span style='font-size: 0px;'>${color}</span>`
      }
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
      cell.appendChild(span);
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
    const h2 = document.createElement("strong");
    h2.style.marginBottom = '1rem';
    const text = lines[0].slice(1).join(' ').replaceAll('\2',' ');
    ansi(h2, '**');
    h2.appendChild(fmtMd(text));
    container.appendChild(h2);
    lines = lines.slice(1);
    ansi(h2, '**\n');
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



  const groups = [];
  let j = 0;
  let k = 0;
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

    if (k + maxl >= (settings.discordMobileFriend ? 32 : 80)) {
      k = 0;
      groups.push(j)
    }
    k += maxl;
  }

  groups.push(j)

  const pre = document.createElement('pre');
  pre.append('```ansi\n')

  let gp = 0;
  for (const k of groups) {
    for (let i = 0; i < lmin; i++) {
      if (italic[i]) ansi(pre, highlightEscape);
      else ansi(pre, metaEscape);
      for (let j = gp; j < k; j++) {
        const col = lines[i][j];
        const text = fmtPre(col.replaceAll('\2',' ')+' ', italic[i] ? highlightEscape : metaEscape);
        if (italic[i]) text.style.color = highlightColor
        else text.style.color = metaColor
        pre.appendChild(text);
      }

      ansi(pre, '[0m');
      pre.appendChild(document.createElement("br"))
    }

    gp = k;
  }

  

  if (settings.discordTranslationInside) {
    if (rest_) {
      const rest = document.createElement("span");
      rest.appendChild(fmtPre(rest_,'[0;00m'));
      pre.appendChild(rest)
      pre.append('\n')
    }
    
    pre.append('```')

    container.appendChild(pre);
    container.style.marginBottom = '1.5em';

    return container;
  }

  if (lines.length) {
    pre.append('```')
    container.appendChild(pre);
  }


  if (rest_) {
    const rest = document.createElement("span");
    rest.appendChild(fmtMd(rest_));
    container.appendChild(rest)
  }

  container.style.marginBottom = '1.5em';

  return container
}

function renderDiscordFancy(value, settings) {
  const container = document.createElement('p');
  value.split(/\n--+\n/).forEach(v => {
    const k = translateDiscordFancy(v, container, settings);
    container.appendChild(k);
  });

  return container
}