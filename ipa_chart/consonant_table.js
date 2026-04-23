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
const DEFAULT_POA_ORDER = [
	'bilabial','labiodental','labial',
	'dental', 'dental sibilant','alveolar','coronal','sibilant','lateral',
	'postalveolar',
	'retroflex',
	'alveolo-palatal',
	'dorsal','palatal','velar','uvular',
	'pharyngeal','glottal',
];

function toTitleCase(str, short=false) {
	let s = str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
		.replace('Labiodental','Labio\u00ADdental')
		.replace('Lateral Approximant','Lateral')
		.replace('Tap-Or-Trill','Tap or Trill')
		.replace('Labialized','Lab.')
		.replace('Palatalized','Pal.')
		.replace('Postalveolar','Post\u00ADalveolar')
		.replace('Pharyngeal','Pharyn\u00ADgeal');
	if (short) {
		s = s
			.replace('ized','')
			.replace('Fricative','Fric.')
			.replace('Affricate','Affr.')
			.replace('Approximant','Apprx.')
			.replace('Sonorant','Sono.')
			.replace('Ejective','Ejec.')
			.replace('Implosive','Impl.')
			.replace('Aspirated','Asp.')
			.replace('Lateral','Lat.')
			.replace('Bilabial','Lab.')
			.replace('Labio\u00ADdental','Lab\u00ADdnt.')
			.replace('Labial','Lab.')
			.replace('Coronal','Cor.')
			.replace('Dental','Dnt.')
			.replace('Alveolar','Alv.')
			.replace('Alveolo','Alv.')
			.replace('Sibilant','Sib.')
			.replace('Post\u00ADalveolar','Post\u00ADAlv.')
			.replace('Retroflex','Rtfx.')
			.replace('Velar','Vel.')
			.replace('Dorsal','Dor.')
			.replace('Uvular','Uvu.')
			.replace('Pharyn\u00ADgeal','Pha.')
			.replace('Palatal','Pal.')
			.replace('Tap or Trill','Vibr.')
			.replace('Glottal','Glt.')
	}
	return s;
}


function replacePOAModifiers(x, z) {
	const mods = [];
	POA_MODIFIERS.forEach(y => {
		if (x.includes(y)) {
			x = x.replace(y, '').trim()
			mods.push(y);
		}
	})
	return mods.join(' ')+z;
}

function hasPOAOverlap({consonants, locked}, poa, cb) {
	if (poa.some(x => locked.includes(x))) return false;

	const present = poa.filter(x => consonants.find(y => y.poa == x))
	if (present.length == 1 || poa.length == 2 && present.length != 2) return false;
	const p = consonants.filter(x => poa.includes(x.poa))
	const p2 = Array.from(new Set(p.map(x => JSON.stringify({...x,label:undefined}))), x=>JSON.parse(x))
	const x = p2.map(x => x.poamods?.join('')+x.moa+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		if (typeof cb == 'function') cb(p);
		else p.forEach(x => {
			x.poa = cb
		})
	}
	return noOverlap;
}

function hasMOAOverlap({consonants, locked}, moa, cb, force=false) {
	if (moa.some(x => locked.includes(x))) return false;

	const present = moa.filter(x => consonants.find(y => y.moa == x))
	if (present.length == 1 || moa.length == 2 && present.length != 2) return false;
	const p = consonants.filter(x => moa.includes(x.moa));
	if (force) {
		cb(p);
		return true;
	}
	const p2 = Array.from(new Set(p.map(x => JSON.stringify({...x,label:undefined,plabel:undefined}))), x=>JSON.parse(x))
	const x = p2.map(x => x.poa+x.poamods?.join(' ')+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		cb(p)
	}
	return noOverlap;
}

const renderConsonants = (consonants, settings=DEFAULT_SETTINGS) => {
	if (consonants.length == 0) return '';

	let DEFAULT_POA = DEFAULT_POA_ORDER;
	let DEFAULT_MOA = settings.nasalTop ? NASAL_MOA_ORDER : IPA_MOA_ORDER;

	const mergeBasic = settings.merge>0;
	const mergeNormal = settings.merge>1;
	const mergeAggressive = settings.merge>2;

	if (mergeAggressive) {
		settings.singleCell = true;
	}

	for (const [names, target] of settings.forceMerge) {
		const ispoa = names.map(x => DEFAULT_POA.includes(x)).reduce((a,b)=>a+b);
		const ismoa = names.map(x => DEFAULT_MOA.includes(x)).reduce((a,b)=>a+b);
		if (ismoa > ispoa) {
			consonants.forEach(x => {
				if (names.includes(x.moa)) {
					x.moa = target;
				}
			})
			if (!DEFAULT_MOA.includes(target)) {
				const where = DEFAULT_MOA.indexOf(names[0]);
				DEFAULT_MOA.splice(where+1, 0, target)
			}
		} else {
			consonants.forEach(x => {
				if (names.includes(x.poa)) {
					x.poa = target;
				}
			})
			if (!DEFAULT_POA.includes(target)) {
				const where = DEFAULT_POA.indexOf(names[0]);
				DEFAULT_POA.splice(where+1, 0, target)
			}
		}
	}

	if (settings.sibilant || (mergeAggressive && consonants.filter(x => x.plabel?.includes('s')).length >= 2)) consonants.forEach(x => {
		const y = x.plabel??'';
		if (y.includes('s') || y.includes('z')) { x.poa = x.poa.replace('alveolar', 'sibilant').replace('dental', 'dental sibilant') }
	})

	if (settings.lateral || (mergeAggressive && consonants.filter(x => x.plabel?.includes('ɬ')).length >= 2)) consonants.forEach(x => {
		if (!x.moa.includes('lateral')) return;
		x.moa = x.moa.replace('lateral', '').trim()
		x.poa = x.poa.replace(/\balveolar/, 'lateral')
	})

	// lateral column

	if (mergeBasic) hasPOAOverlap({consonants, locked: settings.locked}, ['bilabial','labiodental'], 'labial');
	if (mergeNormal) {
		hasPOAOverlap({consonants, locked: settings.locked}, ['palatal','alveolo-palatal'], 'palatal');
		hasPOAOverlap({consonants, locked: settings.locked}, ['dental','alveolar'], 'coronal');
		hasPOAOverlap({consonants, locked: settings.locked}, ['coronal','retroflex'], 'coronal');
		if (hasPOAOverlap({consonants, locked: settings.locked}, ['palatal','postalveolar'], 'palatal')) {
			settings.locked.push('palatal')
		}
	}

	if (mergeBasic) {
		hasMOAOverlap({consonants, locked: settings.locked}, ['tap','trill'], (x) => { x.forEach(y => y.moa = 'tap-or-trill') })
		hasMOAOverlap({consonants, locked: settings.locked}, ['approximant','lateral approximant'], (x) => { x.forEach(y => y.moa = 'approximant') })

		hasMOAOverlap({consonants, locked: settings.locked}, ['stop','affricate'], (x) => { x.forEach(y => y.moa = 'stop') })
		hasMOAOverlap({consonants, locked: settings.locked}, ['prenasalized stop','prenasalized affricate'], (x) => { x.forEach(y => y.moa = 'prenasalized stop') })
		hasMOAOverlap({consonants, locked: settings.locked}, ['aspirated stop','aspirated affricate'], (x) => { x.forEach(y => y.moa = 'aspirated stop') })
		hasMOAOverlap({consonants, locked: settings.locked}, ['ejective','ejective affricate'], (x) => { x.forEach(y => y.moa = 'ejective') })
	}

	if (mergeNormal) {
		hasMOAOverlap({consonants, locked: settings.locked}, ['approximant','tap-or-trill','trill','tap'], (x) => { x.forEach(y => y.moa = 'sonorant') })
		hasMOAOverlap({consonants, locked: settings.locked}, ['fricative','lateral fricative'], (x) => { x.forEach(y => y.moa = 'fricative') })

		if (!hasPOAOverlap({consonants, locked: settings.locked}, ['palatal','velar','uvular'], (x) => {
			x.forEach(y => y.poa = 'dorsal')
		})){ hasPOAOverlap({consonants, locked: settings.locked}, ['palatal','velar'], (x) => {
			x.forEach(y => y.poa = 'dorsal')
		})}
	}

	if (mergeAggressive) {
		const glottalSingle = consonants.filter(x=>x.poa=='glottal');
		if (glottalSingle.length==1 && glottalSingle[0].plabel=='h' && !consonants.find(x=>x.plabel=='x')) {
			hasPOAOverlap({consonants, locked: settings.locked}, ['velar'], 'dorsal');
			glottalSingle[0].poa = 'dorsal';
		}

		

		hasMOAOverlap({consonants, locked: settings.locked}, ['stop','affricate'], (x) => { x.forEach(y => y.moa = 'stop') }, true)
		hasMOAOverlap({consonants, locked: settings.locked}, ['prenasalized stop','prenasalized affricate'], (x) => { x.forEach(y => y.moa = 'prenasalized stop') }, true)
		hasMOAOverlap({consonants, locked: settings.locked}, ['aspirated stop','aspirated affricate'], (x) => { x.forEach(y => y.moa = 'aspirated stop') }, true)
		hasMOAOverlap({consonants, locked: settings.locked}, ['ejective','ejective affricate'], (x) => { x.forEach(y => y.moa = 'ejective') }, true)
		
		hasMOAOverlap({consonants, locked: settings.locked}, ['ejective','stop'], (x) => { x.forEach(y => y.moa = 'stop') })

		consonants
			.filter(x => ['approximant','tap-or-trill','tap','trill','lateral approximant'].includes(x.moa))
			.forEach(y => y.moa = 'sonorant')

		hasMOAOverlap({consonants, locked: settings.locked}, ['sonorant','fricative'], (x) => { x.forEach(y => y.moa = 'sonorant') })
	}

	const container = document.createElement('div');
	container.setAttribute('class', 'consonant-table-container'+(settings.singleCell?'':' doubleCell'));

	const table = document.createElement("table");
	table.classList.add('border')
	container.appendChild(table);
	
	consonants.forEach(x => {
		x.poa = x.poa.trim()
		x.moa = x.moa.trim()
	})

	if (settings.coarticulated) {
		consonants.forEach(x => {
			if (!x.poamods) return;
			x.poa = (x.poamods.join(' ')+' '+x.poa).trim()
		})
	}

	const OTHER_POA = [...new Set(consonants.map(y => y.poa).filter(y => !DEFAULT_POA.includes(y)))];

	for (const k of OTHER_POA) {
		if (k==='undefined') continue;

		const mods = splitPOAModifiers(k);


		const i = DEFAULT_POA.findIndex(x => mods[0] == x);
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
		th.innerText = toTitleCase(poa, settings.shortNames);
		trh.appendChild(th);
	}

	const usedSet = new Set();

	for (const moa of DEFAULT_MOA) {
		const tr = document.createElement('tr');
		table.appendChild(tr);

		const moacons = consonants.filter(x => x.moa == moa);

		if (moacons.length == 0) continue;

		const th = document.createElement('th');
		th.innerText = toTitleCase(moa, settings.shortNames);
		th.style.whiteSpace = 'nowrap';
		tr.appendChild(th);
		for (const poa of DEFAULT_POA) {
			const poacons = moacons.filter(x => x.poa == poa);

			poacons.forEach(x => usedSet.add(x))
			
			const voiced = poacons.filter(x => x.voice >= 0).map(x => x.label)
			const voiceless = poacons.filter(x => x.voice < 0).map(x => x.label)

			const td1 = document.createElement('td');
			const td2 = document.createElement('td');

			if (settings.singleCell) {
				td1.innerText = [...voiceless,...voiced].join(' ')
				td1.colSpan = 2;
				
				tr.appendChild(td1);
			} else {
				td1.innerText = voiceless.join('\n')
				td2.innerText = voiced.join('\n')
				
				tr.appendChild(td1);
				tr.appendChild(td2);
			}
		}
	}

	{
	const sounds = consonants.filter(x => !usedSet.has(x)).map(x=>x.label);
	if (sounds.length) {
		const other = document.createElement('p');
		other.innerText = `Other sounds: ${sounds.join(' ')}`
		container.appendChild(other);
	}}

	return container.outerHTML;
};