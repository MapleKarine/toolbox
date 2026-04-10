const IPA_MOA_ORDER = [
	'stop','ejective','implosive','affricate',
	'nasal',
	'trill','tap','tap-or-trill',
	'fricative',
	'lateral affricate','lateral fricative',
	'approximant','lateral approximant',
	'sonorant',
];
const NASAL_MOA_ORDER = [
	'nasal',
	'stop','ejective','implosive','affricate',
	'fricative','lateral affricate','lateral fricative',
	'trill','tap','tap-or-trill',
	'approximant','lateral approximant',
	'sonorant',
];

function toTitleCase(str) {
	return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
		.replace('Labiodental','Labio-dental')
		.replace('Tap-Or-Trill','Tap or Trill')
		.replace('Labialized','Lab.')
		.replace('Palatalized','Pal.')
		.replace('Postalveolar','Post-alveolar');
}

function hasPOAOverlap(consonants, poa, cb) {
	const present = poa.filter(x => consonants.find(y => y.poa == x))
	if (present.length == 1 || poa.length == 2 && present.length != 2) return false;
	const p = consonants.filter(x => poa.includes(x.poa))
	const p2 = Array.from(new Set(p.map(x => JSON.stringify({...x,label:undefined}))), x=>JSON.parse(x))
	const x = p2.map(x => x.moa+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		cb(p)
	}
	return noOverlap;
}

function hasMOAOverlap(consonants, moa, cb, force=false) {
	const present = moa.filter(x => consonants.find(y => y.moa == x))
	if (present.length == 1 || moa.length == 2 && present.length != 2) return false;
	const p = consonants.filter(x => moa.includes(x.moa));
	if (force) {
		cb(p);
		return true;
	}
	const p2 = Array.from(new Set(p.map(x => JSON.stringify({...x,label:undefined}))), x=>JSON.parse(x))
	const x = p2.map(x => x.poa+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		cb(p)
	}
	return noOverlap;
}

const renderConsonants = (consonants, settings=DEFAULT_SETTINGS) => {
	if (consonants.length == 0) return '';

	if (settings.sibilant) consonants.forEach(x => {
		if (x.label.includes('s') || x.label.includes('z')) {
			x.poa = 'sibilant'
		}
	})

	hasPOAOverlap(consonants, ['bilabial','labiodental'], (x) => {
		x.forEach(y => y.poa = 'labial')
	});

	hasPOAOverlap(consonants, ['palatal','alveolo-palatal'], (x) => {
		x.forEach(y => y.poa = 'palatal')
	});

	if (!hasPOAOverlap(consonants, ['palatal','velar','uvular'], (x) => {
		x.forEach(y => y.poa = 'dorsal')
	})) {if(!hasPOAOverlap(consonants, ['palatal','velar'], (x) => {
		x.forEach(y => y.poa = 'dorsal')
	})) {
		hasPOAOverlap(consonants, ['palatal','postalveolar'], (x) => {
			x.forEach(y => y.poa = 'palatal')
		})
	}}

	hasPOAOverlap(consonants, ['dental','alveolar'], (x) => {
		x.forEach(y => y.poa = 'coronal')
	});

	hasMOAOverlap(consonants, ['tap','trill'], (x) => { x.forEach(y => y.moa = 'tap-or-trill') })

	if (settings.affricate && hasMOAOverlap(consonants, ['stop','affricate'], (x) => { x.forEach(y => y.moa = 'stop') })) {
		hasMOAOverlap(consonants, ['prenasalized stop','prenasalized affricate'], (x) => { x.forEach(y => y.moa = 'prenasalized stop') })
		hasMOAOverlap(consonants, ['aspirated stop','aspirated affricate'], (x) => { x.forEach(y => y.moa = 'aspirated stop') })
		hasMOAOverlap(consonants, ['ejective','ejective affricate'], (x) => { x.forEach(y => y.moa = 'ejective') })
	}

	hasMOAOverlap(consonants, ['approximant','lateral approximant'], (x) => { x.forEach(y => y.moa = 'approximant') })

	hasMOAOverlap(consonants, ['approximant','tap-or-trill','tap','trill'], (x) => { x.forEach(y => y.moa = 'approximant') })

	hasMOAOverlap(consonants, ['fricative','lateral fricative'], (x) => { x.forEach(y => y.moa = 'fricative') })

	if (settings.sonorant) {
		hasMOAOverlap(consonants, ['approximant','tap-or-trill','tap','trill','lateral'], (x) => { x.forEach(y => y.moa = 'sonorant') }, true)
	}

	const container = document.createElement('div');
	container.setAttribute('class', 'consonant-table-container');

	const table = document.createElement("table");
	table.classList.add('border')
	container.appendChild(table);
	
	let DEFAULT_POA = ['bilabial','labiodental','labial','dental','alveolar','coronal','sibilant','postalveolar','retroflex','alveolo-palatal','dorsal','palatal','velar','uvular','pharyngeal','glottal'];
	let DEFAULT_MOA = settings.nasalTop ? NASAL_MOA_ORDER : IPA_MOA_ORDER;

	const OTHER_POA = [...new Set(consonants.filter(y => !DEFAULT_POA.includes(y.poa))
			.map(y => y.poa))];

	for (const k of OTHER_POA) {
		if (k==='undefined') continue;
		const i = DEFAULT_POA.findIndex(x => k.endsWith(x));
		DEFAULT_POA.splice(i+1, 0, k)
	}

	DEFAULT_POA = DEFAULT_POA.filter(x => consonants.find(y => y.poa == x));
	const OTHER_MOA = [...new Set(consonants.filter(y => !DEFAULT_MOA.includes(y.moa))
			.map(y => y.moa))];

	for (const k of OTHER_MOA) {
		if (k==='undefined') continue;
		const i = DEFAULT_MOA.findIndex(x => k.endsWith(x));
		DEFAULT_MOA.splice(i+1, 0, k)
	}

	




	const trh = document.createElement('tr');
	table.appendChild(trh);

	trh.appendChild(document.createElement('th'));
	for (const poa of DEFAULT_POA) {
		const th = document.createElement('th');
		th.setAttribute('colspan', 2);
		th.innerText = toTitleCase(poa);
		trh.appendChild(th);
	}

	const usedSet = new Set();

	for (const moa of DEFAULT_MOA) {
		const tr = document.createElement('tr');
		table.appendChild(tr);

		const moacons = consonants.filter(x => x.moa == moa);

		if (moacons.length == 0) continue;

		const th = document.createElement('th');
		th.innerText = toTitleCase(moa);
		th.style.whiteSpace = 'nowrap';
		tr.appendChild(th);
		for (const poa of DEFAULT_POA) {
			const poacons = moacons.filter(x => x.poa == poa);

			poacons.forEach(x => usedSet.add(x))
			
			const voiced = poacons.filter(x => x.voice >= 0).map(x => x.label)
			const voiceless = poacons.filter(x => x.voice < 0).map(x => x.label)


			const td1 = document.createElement('td');
			const td2 = document.createElement('td');

			td1.innerText = voiceless.join('\n')
			td2.innerText = voiced.join('\n')

			// td1.innerText = ['voiceless',poa,moa].join(' ')
			// td2.innerText = ['voiced',poa,moa].join(' ')
			
			tr.appendChild(td1);
			tr.appendChild(td2);
		}
	}

	{
	const sounds = consonants.filter(x => !usedSet.has(x)).map(x=>x.label);
	if (sounds.length) {
		const other = document.createElement('p');
		other.innerText = `Other sounds: ${sounds.join(' ')}`
		container.appendChild(other);
	}}

	// for (const vowel of vowels) {
	// 	const [x, y] = positionFunc(vowel.x, vowel.y);

	// 	if (vowel.dot!='middle') {
	// 		const dotEl = document.createElement('span');
	// 		dotEl.setAttribute('class', 'vowel-chart-text-dot');
	// 		dotEl.setAttribute('style', `left: ${(x*settings.size+32)-3}px; top: ${(y*settings.size+16)-3}px;`);
	// 		textFloat.appendChild(dotEl);
	// 	}
	// 	const text = document.createElement('span');
	// 	text.setAttribute('class', 'vowel-chart-text-float '+vowel.dot);
	// 	text.setAttribute('style', `left: ${(x*settings.size+32)+(vowel.dot=='left'?-4:vowel.dot=='right'?4:0)}px; top: ${(y*settings.size+16)}px;`);
	// 	text.innerText = vowel.label;
	// 	textFloat.appendChild(text);
	// }

	// drawSVG(svgEl, settings.layout.toLowerCase(), settings.size);

	return container.outerHTML;
};