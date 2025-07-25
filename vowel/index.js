let osc, playing, amp, saw, noi;
let filters;
let fft;

const C = 34300;

function openTube(l, d) {
  return C/(4*(l+d*0.3))
}

function closedTube(l, d) {
  return C/(2*l)
}

function constrictTube(l1, l2, d1, d2) {
  const V = PI/4*pow(d1, 2)*l1;
  const A2 = PI/4*pow(d2, 2);
  const Leq = l2 + 0.85*d2;
  return (C/TAU)*sqrt(A2/(V*Leq))
}

function drawTube(x, y, l1, l2, l3, d1, d2, d3, e3) {
  noFill();
  const T = 20;
  stroke(255, 0, 255);
  line(x, y-5*d1, x+l1*T, y-5*d1);
  line(x, y+5*d1, x+l1*T, y+5*d1);
  x += l1*T;

  line(x,y-5*d1,x,y-5*d2);
  line(x,y+5*d1,x,y+5*d2);

  line(x, y-5*d2, x+l2*T, y-5*d2);
  line(x, y+5*d2, x+l2*T, y+5*d2);
  x += l2*T;

  line(x,y-5*d2,x,y-5*d3);
  line(x,y+5*d2,x,y+5*d3);

  line(x, y-5*d3, x+l3*T, y-5*d3);
  line(x, y+5*d3, x+l3*T, y+5*d3);
  x += l3*T;

  line(x,y-5*d3,x,y-5*e3);
  line(x,y+5*d3,x,y+5*e3);
}

// function constrict(l1,l2,L, D, d, k) {
//   const l3 = (L-l2-l1)+0.6*(D/2);
//   const A1 = TAU/8*pow(D, 2);
//   const A2 = TAU/8*pow(d, 2);
//   return [
//     C/(2*l1),
//     C/(4*l3),
//     3*C/(4*l3),
//     (C/TAU)*sqrt(A2/(A1*l1*l2)),
//   ].map(floor).sort((a,b)=>a-b)
// }

function createGlottalSource() {
  const k = 44100;
  
  const buffer = new Array(k*0.5);
  const t0 = 0.9;
  const f0 = 120;
  let phs = 0;
  let acp = 0
  let dph = f0/k;
  for (let i = 0; i < k*0.5; i++) {
    buffer[i] = 8*(acp**2 - acp**3)
    phs = (phs+dph)%1
    acp = (phs < t0) ? 0 : (phs-t0)/(1-t0)
  }
  
  const sound = new p5.SoundFile();
  sound.setBuffer([buffer]);
  
  return sound;
}

function setup() {
  let cnv = createCanvas(400, 400);
  fill(255, 0, 255);
  cnv.elt.addEventListener("contextmenu", (e) => e.preventDefault())
  
  cnv.mousePressed(playOscillator);
  
  osc = new p5.Gain();
  
  saw = createGlottalSource()
  
  noi = new p5.Noise();
  noi.amp(0.03)
  
  saw.disconnect();
  saw.connect(osc);
  noi.disconnect();
  noi.connect(osc);
  
  filters = new Array(4)
    .fill(null)
    .map(() => new p5.BandPass());
  
  const k = 1
  filters[0].res(5*k);
  filters[0].amp(1);
  filters[1].res(20*k);
  filters[1].amp(0.6);
  filters[2].res(50*k);
  filters[2].amp(0.3);
  filters[3].res(80*k);
  filters[3].amp(0.1);
  
  osc.disconnect();
  filters.forEach(f => osc.connect(f))

  // saw.loop(0,0.55);
  saw.loop(0,0.65);
  saw.amp(0);

  fft = new p5.FFT();
}

const vowels = {
  'u': [7, 3, 6, 3.4, 0.8, 3.4, 1.0, ['cons-1', 'cons-3', 'closed-1', 'closed-3']],
  'o': [7, 3, 6, 3.4, 1.2, 3.4, 1.2, ['closed-1', 'cons-1', 'cons-3', 'closed-3']],
  // 'ɔ': [6, 3, 7, 3.4, 1.8, 3.4, 1.4, ['closed-1', 'cons-1', 'cons-3', 'closed-3' ]],
  'ɔ': [7, 3, 6, 3.4, 1.8, 3.4, 1.4, ['closed-1', 'cons-1', 'cons-3', 'closed-3' ]],

  'ɯ': [7, 3, 6, 3.4, 0.8, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3']],
  'ɤ': [7, 3, 6, 3.4, 1.2, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3' ]],
  // 'ʌ': [6, 3, 7, 3.4, 1.8, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3' ]],
  'ʌ': [7, 3, 6, 3.4, 1.8, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3' ]],

  'ɑ': [6, 3, 7, 3.4, 2.4, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3' ]],
  'ɒ': [6, 3, 7, 3.4, 2.2, 3.4, 2.0, ['closed-1', 'cons-1', 'cons-3', 'closed-3' ]],
  // 'a': [8, 8, 0, 1.4, 3.4, 3.4, 3.4, ['open-1', 'open-2']],
  // 'ɑ': [6, 10, 0, 1.4, 3.4, 3.4, 3.4, ['open-1', 'open-2']],
  'a': [5.5, 10.5, 0, 2.4, 3.4, 3.4, 3.4, ['open-1', 'open-2']],
  // 'æ': [9, 4, 3, 3.0, 3.0, 3.0, 3.0, ['closed-1','cons-1', 'open-3']],
  'æ': [10, 2, 4, 3.4, 3.0, 3.4, 3.0, ['closed-1','cons-1', 'open-3']],
  'ə': [16, 0, 0, 3.4, 3.4, 3.4, 3.4, ['open-1']],
  // 'a': [9, 7, 0, 3.4, 3.4, 3.4, 3.4, ['open-1', 'open-2']],

  'ɛ': [9, 4, 3, 3.4, 2.8, 3.4, 3.4, ['closed-1','cons-1', 'open-3']],
  'e': [8.5, 4.5, 3, 3.4, 1.4, 3.4, 3.4, ['closed-1','cons-1', 'open-3']],
  'i': [8, 5, 3, 3.4, 0.8, 3.4, 3.4, ['closed-1', 'cons-1', 'open-3']],

  'œ': [9,   4,   3, 3.4, 3.0, 3.0, 2.0, ['closed-1','cons-1', 'closed-3', 'cons-3']], // [9, 3, 4, 3.4, 2.4, 3.4, 2.4, ['closed-1', 'cons-1', 'closed-3', 'cons-3']],
  'ø': [8.5, 4.5, 3, 3.4, 1.4, 3.0, 2.4, ['closed-1','cons-1', 'closed-3', 'cons-3']], // [9, 3, 4, 3.4, 1.4, 3.4, 2.4, ['closed-1', 'cons-1', 'closed-3', 'cons-3']],
  'y': [8,     5, 3, 3.4, 0.8, 2.2, 1.4, ['closed-1', 'cons-1', 'closed-3', 'cons-3']], // [10, 3, 3, 3.4, 0.8, 3.4, 2.0, ['closed-1', 'cons-1', 'closed-3', 'cons-3']],
}

const grid = [
  ['i','y','ɯ', 'u'],
  ['e','ø','ɤ', 'o'],
  ['ɛ','œ','ʌ', 'ɔ'],
  [ 'æ', 'a','ɑ','ɒ'],
]

let sel;
function draw() {
  background(220);
  let VIEW = 200;

  let l1, l2, l3;
  let d1, d2, d3, d4;

  const keys = Object.keys(vowels);
  const sx = floor(constrain(map(mouseY, 0, height, 0, 4), 0, 3));
  const sy = floor(constrain(map(mouseX, 0, width, 0, 4), 0, 3));

  let sw = dist(mouseX, mouseY, 200, 200) < 50 ? 'ə' : grid[sx][sy] || 'a';

  fill(225,189,225);
  if (sw != 'ə') {
    rect(sy*100,sx*100,100,100)
    fill(255,0,255);
    textSize(16);
    text(`${sw}`, sy*100+50,sx*100+50);
  } else {
    circle(200,200,100)
    fill(255,0,255);
    textSize(16);
    text(`${sw}`, 200,200);
  }
  
  textSize(12);
  if (sw) sel = vowels[sw];

  l1 = sel[0];l2 = sel[1];l3 = sel[2];
  d1 = sel[3];d2 = sel[4];d3 = sel[5];d4 = sel[6];

  // d4 = map(mouseY, 0, height, 0.1, 3.4)

  const res = sel[7].flatMap(x => {
    const ls = [l1,l2,l3,0];
    const ds = [d1,d2,d3,d4];
    let [t, n] = x.split('-'); n = (+n)-1;
    if (t=='open') return [ openTube(ls[n], ds[n]), 3*openTube(ls[n], ds[n]), 5*openTube(ls[n], ds[n]), 7*openTube(ls[n], ds[n]) ]
    if (t=='closed') return [ closedTube(ls[n], ds[n]), 2*closedTube(ls[n], ds[n]) ]
    if (t=='cons') return [ constrictTube(ls[n], ls[n+1], ds[n], ds[n+1]) ]
  }).map(floor).sort((a,b)=>a-b)

  filters.forEach((f, i) => f.freq(res[i]))

  drawTube(0, 90, l1, l2, l3, d1, d2, d3, d4);

  // fill(255, 0, 255);
  rect(VIEW,VIEW,VIEW,VIEW);
  fill(255, 0, 255);
  noStroke();


  text(`f1 ${res[0]}, f2 ${res[1]}, f3 ${res[2]}`, 200, 200-10);
  

  
  let spectrum = fft.analyze();
  noStroke();
  const leng = spectrum.length/4;
  for (let i = 0; i < leng; i++) {
    let x = map(i, 0, leng, 0, width);
    let h = - map(spectrum[i], 0, 255, 0, VIEW);
    rect(x, height, VIEW/leng, h);
  }

  circle(VIEW+map(res[1], 500, 2500, VIEW, 0), VIEW+map(res[0], 0, 1000, 0, VIEW), 4);

  if (playing) {
    // f1.freq(freq1, 0.0);
    // f2.freq(freq2, 0.0);
    // f3.freq(freq3, 0.0);
    osc.amp(1, 0.1);
  }
}

function playOscillator() {
  saw.amp(1, 0.5);
  noi.start();
  playing = true;
}


function mouseReleased() {
  osc.amp(0, 0.3);
  playing = false;
  
}