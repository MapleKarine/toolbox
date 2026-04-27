const IPA_MOA_ORDER = [
	'click', 'nasal click',
	'stop','ejective','implosive','affricate',
	'nasal',
	'trill','tap','tap-or-trill',
	'fricative',
	'lateral affricate','lateral fricative',
	'approximant','lateral approximant',
	'sonorant',
];
const NASAL_MOA_ORDER = [
	'click', 'nasal click',
	'nasal',
	'stop','ejective','implosive','affricate',
	'fricative','lateral affricate','lateral fricative',
	'trill','tap','tap-or-trill',
	'approximant','lateral approximant',
	'sonorant',
];
const DEFAULT_POA_ORDER = [
	'bilabial','labiodental','labial',
	'dental','dental sibilant','alveolar','coronal',
	'sibilant','lateral',
	'postalveolar',
	'retroflex',
	'alveolo-palatal',
	'palatal','velar','labiovelar','dorsal','uvular',
	'pharyngeal','glottal',
];

function toTitleCase(str, short=false) {
	let s = str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
		.replace('Labiodental','Labio\u00ADdental')
		.replace('Labiovelar','Labio\u00ADvelar')
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
			.replace('Bilabial','Blb.')
			.replace('Labio\u00ADdental','Lab\u00ADdnt.')
			.replace('Labial','Lab.')
			.replace('Coronal','Cor.')
			.replace('Dental','Dnt.')
			.replace('Alveolar','Alv.')
			.replace('Alveolo','Alv.')
			.replace('Sibilant','Sib.')
			.replace('Post\u00ADalveolar','Post\u00ADAlv.')
			.replace('Retroflex','Rtfx.')
			.replace('Labio\u00ADvelar','Lab\u00ADvel.')
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
	const x = p2.map(x => x.poamods?.join('')+x.moamods?.join('')+x.moa+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		if (typeof cb == 'function') cb(p);
		else p.forEach(x => {
			x.poa = cb
		})
	}
	return noOverlap;
}

function hasPOAModOverlap({consonants, locked}, poa) {
	const p = consonants.filter(x => x.poa == poa)
	if (p.length == 0) return false;

	const x = p.map(x => x.moamods?.join('')+x.moa+x.voice);

	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		p.forEach(x => {
			x.poamods = []
		})
	}
	return noOverlap;
}

function hasMOAModOverlap({consonants, locked}, moa) {
	const p = consonants.filter(x => x.moa == moa)
	if (p.length == 0) return false;
	const x = p.map(x => x.poamods?.join('')+x.poa+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) { p.forEach(x => x.moamods = []) }
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
	const x = p2.map(x => x.poa+x.poamods?.join(' ')+x.moamods?.join('')+x.voice);
	const noOverlap = x.length == [...new Set(x)].length;
	if (noOverlap) {
		cb(p)
	}
	return noOverlap;
}

const renderConsonants = (consonants, settings=DEFAULT_SETTINGS) => {
	if (consonants.length == 0) return '';

	let DEFAULT_POA = [...DEFAULT_POA_ORDER];
	let DEFAULT_MOA = [...(settings.nasalTop ? NASAL_MOA_ORDER : IPA_MOA_ORDER)];

	const mergeBasic = settings.merge>0;
	const mergeNormal = settings.merge>1;
	const mergeAggressive = settings.merge>2;

	if (mergeAggressive) {
		settings.singleCell = true;
	}

	const usedMerges = new Set();
	for (const _i of settings.forceMerge) {
		const [names, target] = _i;
		if (names.length == 1 && names[0]==target) {
			continue;
		}
		const ispoa = names.map(x => DEFAULT_POA.includes(x)).reduce((a,b)=>a+b);
		const ismoa = names.map(x => DEFAULT_MOA.includes(x)).reduce((a,b)=>a+b);
		if (POA_MODIFIERS.some(x => names.some(y => y.includes(x)))) continue;
		if (MOA_MODIFIERS.some(x => names.some(y => y.includes(x)))) continue;
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
		usedMerges.add(_i);
	}

	if (settings.sibilant || (mergeAggressive && consonants.filter(x => x.plabel?.includes('s')).length >= 2)) consonants.forEach(x => {
		const y = x.plabel??'';
		if (y.includes('s') || y.includes('z')) { x.poa = x.poa.replace('alveolar', 'sibilant').replace('dental', 'dental sibilant') }
	})

	if (settings.lateral || (mergeAggressive && consonants.filter(x => x.plabel?.includes('ɬ')).length >= 2)) consonants.forEach(x => {
		if (!x.moamods.includes('lateral')) return;
		// x.moa = x.moa.replace('lateral', '').trim()
		x.moamods = x.moamods.filter(x => x!='lateral')
		x.poa = x.poa.replace(/\balveolar/, 'lateral')
	})

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
		
		hasMOAModOverlap({consonants, locked: settings.locked}, 'approximant')

		hasMOAOverlap({consonants, locked: settings.locked}, ['stop','affricate'], (x) => { x.forEach(y => y.moa = 'stop') })
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

		hasMOAOverlap({consonants, locked: settings.locked}, ['ejective','stop'], (x) => { x.forEach(y => y.moa = 'stop') })

		consonants
			.filter(x => ['approximant','tap-or-trill','tap','trill'].includes(x.moa))
			.forEach(y => y.moa = 'sonorant')

		// hasMOAOverlap({consonants, locked: settings.locked}, ['sonorant','fricative'], (x) => { x.forEach(y => y.moa = 'sonorant') })
	}

	if (settings.ignoreMods.length) {
		consonants.forEach(x => {
			x.poamods = x.poamods.filter(x => !settings.ignoreMods.includes(x))
			x.moamods = x.moamods.filter(x => !settings.ignoreMods.includes(x))
		})
	}

	if (mergeBasic) {
		DEFAULT_POA.forEach(x => settings.locked.includes(x) ? (void 0) : hasPOAModOverlap({consonants}, x))
		DEFAULT_MOA.forEach(x => settings.locked.includes(x) ? (void 0) : hasMOAModOverlap({consonants}, x))
	}

	const container = document.createElement('div');
	container.setAttribute('class', 'consonant-table-container'+((settings.singleCell||settings.voicingRows)?'':' doubleCell'));

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

	consonants.forEach(x => {
		if (!x.moamods) return;
		x.moa = (x.moamods.join(' ')+' '+x.moa).trim()
	})

	for (const _i of settings.forceMerge) {
		const [names, target] = _i;
		if (usedMerges.has(_i)) continue;
		if (settings.voicingRows && names.length == 1 && names[0]==target) {
			consonants.forEach(x => {
				if (x.moa == target) {
					x.voice = 0;
				}
			})
			continue;
		}
		const ispoa = POA_MODIFIERS.some(x => names.some(y => y.includes(x)));
		const ismoa = MOA_MODIFIERS.some(x => names.some(y => y.includes(x)));
		consonants.forEach(x => {
			if (ismoa && names.includes(x.moa)) {
				x.moa = target;
			} else if (ispoa && names.includes(x.poa)) {
				x.poa = target;
			}
		})
	}

	const OTHER_POA = [...new Set(consonants.map(y => y.poa).filter(y => !DEFAULT_POA.includes(y)))];

	function findIndex(list, val) {
		if (val=='') return -1;
		const i = list.findIndex(x => val == x);
		if (i == -1) { return list.length-1; }
		return i;
	}

	for (const k of OTHER_POA) {
		if (k==='undefined' || DEFAULT_POA.includes(k)) continue;

		const mods = splitPOAModifiers(k);
		let label = k, i = -1;
		if (k.includes('>')) {
			const [a, b] = k.split('>');
			label = b
			i = findIndex(DEFAULT_POA, a);
			consonants.forEach(x => {if (x.poa == k) x.poa = b});
			if (DEFAULT_POA.includes(b)) DEFAULT_POA = DEFAULT_POA.filter(x=>x!=b);
		} else {
			i = findIndex(DEFAULT_POA, mods[0]);
		}
		DEFAULT_POA.splice(i+1, 0, label);
	}

	DEFAULT_POA = DEFAULT_POA.filter(x => consonants.find(y => y.poa == x));
	const OTHER_MOA = [...new Set(consonants.filter(y => !DEFAULT_MOA.includes(y.moa))
			.map(y => y.moa))];

	for (const k of OTHER_MOA) {
		if (k==='undefined') continue;

		const mods = splitMOAModifiers(k);
		let label = k, i = -1;
		if (k.includes('>')) {
			const [a, b] = k.split('>');
			label = b
			i = findIndex(DEFAULT_MOA, a);
			consonants.forEach(x => {if (x.moa == k) x.moa = b});
		} else {
			i = findIndex(DEFAULT_MOA, mods[0]);
		}
		DEFAULT_MOA.splice(i+1, 0, label);
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
		let tr = document.createElement('tr');
		let tr2 = null;
		table.appendChild(tr);

		const moacons = consonants.filter(x => x.moa == moa);

		if (moacons.length == 0) continue;

		const th = document.createElement('th');
		th.innerText = toTitleCase(moa, settings.shortNames);
		th.style.whiteSpace = 'nowrap';

		const voiced = moacons.filter(x => x.voice >= 0);
		if (settings.voicingRows && moacons.length == voiced.length) {
			tr.appendChild(th);
			tr2 = tr;
			tr = null;
		} else if (settings.voicingRows && voiced.length > 0) {
			tr2 = document.createElement('tr');
			table.appendChild(tr2);
			tr.appendChild(th);
			th.rowSpan = 2;
		} else {
			tr.appendChild(th);
		}
		for (const poa of DEFAULT_POA) {
			const poacons = moacons.filter(x => x.poa == poa);

			poacons.forEach(x => usedSet.add(x))
			
			const voiced = poacons.filter(x => x.voice >= 0).map(x => x.label)
			const voiceless = poacons.filter(x => x.voice < 0).map(x => x.label)

			const td1 = document.createElement('td');
			const td2 = document.createElement('td');

			if (settings.voicingRows) {
				if (tr) {
					td1.innerText = [...voiceless].join(' ')
					td1.colSpan = 2;
					tr.appendChild(td1);
				}

				if (tr2) {
					td2.innerText = [...voiced].join(' ')
					td2.colSpan = 2;
					tr2.appendChild(td2);
				}
			} else if (settings.singleCell) {
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