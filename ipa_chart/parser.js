const IPA_CONSONANTS = {
	'm': [1,'bilabial', 'nasal'],
	'ɱ': [1,'labiodental', 'nasal'],
	'n': [1,'alveolar', 'nasal'],
	'ŋ': [1,'velar', 'nasal'],
	'ɲ': [1,'palatal', 'nasal'],
	'ɴ': [1,'uvular', 'nasal'],
	'ɳ': [1,'retroflex', 'nasal'],
	'n̪': [1,'dental', 'nasal'],
	'n̠': [1,'postalveolar', 'nasal'],
	'ʔ': [-1,'glottal', 'stop'],
	'p': [-1,'bilabial', 'stop'],
	'p̪': [-1,'labiodental', 'stop'],
	't': [-1,'alveolar', 'stop'],
	'k': [-1,'velar', 'stop'],
	'c': [-1,'palatal', 'stop'],
	'q': [-1,'uvular', 'stop'],
	'ʈ': [-1,'retroflex', 'stop'],
	't̪': [-1,'dental', 'stop'],
	'b': [1,'bilabial', 'stop'],
	'b̪': [1,'labiodental', 'stop'],
	'd': [1,'alveolar', 'stop'],
	'g': [1,'velar', 'stop'],
	'ɟ': [1,'palatal', 'stop'],
	'ɢ': [1,'uvular', 'stop'],
	'ɖ': [1,'retroflex', 'stop'],
	'd̪': [1,'dental', 'stop'],
	'ʡ': [-1, 'pharyngeal', 'stop'],
	'ɓ': [1,'bilabial', 'implosive'],
	'ɗ': [1,'alveolar', 'implosive'],
	'ɠ': [1,'velar', 'implosive'],
	'ʄ': [1,'palatal', 'implosive'],
	'ʛ': [1,'uvular', 'implosive'],
	'ᶑ': [1,'retroflex', 'implosive'],
	'tʃ': [-1,'postalveolar', 'affricate'],
	'ts': [-1,'alveolar', 'affricate'],
	'dz': [1,'alveolar', 'affricate'],
	'dʒ': [1,'postalveolar', 'affricate'],
	'tɕ': [-1, 'alveolo-palatal','affricate'],
	'dʑ': [1, 'alveolo-palatal','affricate'],
	'ʈʂ': [-1, 'retroflex','affricate'],
	'ɖʐ': [1, 'retroflex','affricate'],
	't̪s̪': [-1, 'dental','affricate'],
	'd̪z̪': [1, 'dental','affricate'],
	't̠ʃ': [-1, 'postalveolar','affricate'],
	'd̠ʒ': [1, 'postalveolar','affricate'],
	'tʂ': [-1, 'retroflex','affricate'],
	'dʐ': [1, 'retroflex','affricate'],
	'pɸ': [-1, 'bilabial','affricate'],
	'bβ': [1, 'bilabial','affricate'],
	'p̪f': [-1, 'labiodental','affricate'],
	'pf': [-1, 'labiodental','affricate'],
	'b̪v': [1, 'labiodental','affricate'],
	'bv': [1, 'labiodental','affricate'],
	't̪θ': [-1, 'dental','affricate'],
	'd̪ð': [1, 'dental','affricate'],
	'tθ': [-1, 'dental','affricate'],
	'dð': [1, 'dental','affricate'],
	'cç': [-1, 'palatal','affricate'],
	'ɟʝ': [1, 'palatal','affricate'],
	'kx': [-1, 'velar','affricate'],
	'gɣ': [1, 'velar','affricate'],
	'qχ': [-1, 'uvular','affricate'],
	'ɢʁ': [1, 'uvular','affricate'],
	'ʡʜ': [-1, 'pharyngeal','affricate'],
	'ʡʢ': [1, 'pharyngeal','affricate'],
	'ʔh': [-1, 'glottal','affricate'],

	'tɬ': [-1,'alveolar', 'lateral affricate'],
	'ɬ̪': [-1,'dental', 'lateral fricative'],
	'ɬ': [-1,'alveolar', 'lateral fricative'],
	'tɬʼ': [-1,'alveolar', 'lateral affricate'],
	'ɬ̪ʼ': [-1,'dental', 'lateral fricative'],
	'ɬʼ': [-1,'alveolar', 'lateral fricative'],
	'ꞎ': [-1,'retroflex', 'lateral fricative'],
	'ɮ': [1,'alveolar', 'lateral fricative'],
	'ʎ̝': [1,'palatal', 'lateral fricative'],
	'ʟ̝': [1,'velar', 'lateral fricative'],
	'tꞎ': [-1,'retroflex', 'lateral affricate'],
	'dɮ': [1,'alveolar', 'lateral affricate'],
	'ç': [-1,'palatal', 'fricative'],
	'χ': [-1,'uvular', 'fricative'],
	'f': [-1,'labiodental', 'fricative'],
	'ɸ': [-1,'bilabial', 'fricative'],
	'θ': [-1,'dental', 'fricative'],
	'θ̠': [-1,'alveolar', 'fricative'],
	'θ̪': [-1,'alveolar', 'fricative'],
	's': [-1,'alveolar', 'fricative'],
	's̪': [-1,'dental', 'fricative'],
	'x': [-1,'velar', 'fricative'],
	'ʂ': [-1,'retroflex', 'fricative'],
	'ʃ': [-1,'postalveolar', 'fricative'],
	'ɕ': [-1, 'alveolo-palatal','fricative'],
	'ʑ': [1, 'alveolo-palatal','fricative'],
	'ʝ': [1,'palatal', 'fricative'],
	'ʁ': [1,'uvular', 'fricative'],
	'v': [1,'labiodental', 'fricative'],
	'β': [1,'bilabial', 'fricative'],
	'ð': [1,'dental', 'fricative'],
	'ð̠': [1,'alveolar', 'fricative'],
	'ð̪': [1,'alveolar', 'fricative'],
	'z': [1,'alveolar', 'fricative'],
	'z̪': [1,'dental', 'fricative'],
	'ɣ': [1,'velar', 'fricative'],
	'ʐ': [1,'retroflex', 'fricative'],
	'ʒ': [1,'postalveolar', 'fricative'],
	'h': [-1,'glottal', 'fricative'],
	'ɦ': [1,'glottal', 'fricative'],
	'ħ': [-1, 'pharyngeal','fricative'],
	'ʕ': [1, 'pharyngeal','fricative'],
	'l': [0,'alveolar', 'lateral approximant'],
	'l̪': [0,'dental', 'lateral approximant'],
	'l̠': [0,'postalveolar', 'lateral approximant'],
	'ɭ': [0,'retroflex', 'lateral approximant'],
	'ʟ': [0,'velar', 'lateral approximant'],
	'ʟ̠': [0,'uvular', 'lateral approximant'],
	'ʎ': [0,'palatal', 'lateral approximant'],
	'w': [0,'bilabial', 'approximant'],
	'β̞': [0,'bilabial', 'approximant'],
	'ʍ': [-1, 'bilabial', 'approximant'],
	'j': [0,'palatal', 'approximant'],
	'ɰ': [0,'velar', 'approximant'],
	'ɹ': [0,'alveolar', 'approximant'],
	'ɹ̠': [0,'postalveolar', 'approximant'],
	'ɻ': [0,'retroflex', 'approximant'],
	'ʋ': [0,'labiodental', 'approximant'],
	'ð̞': [1,'dental','approximant'],
	'ʁ̞': [1,'uvular','approximant'],
	'r': [0,'alveolar', 'trill'],
	'r̠': [0,'postalveolar', 'trill'],
	'ɽ': [0,'retroflex', 'tap'],
	'ʙ': [0, 'bilabial','trill'],
	'ʀ': [0, 'uvular','trill'],
	'ⱱ': [0, 'labiodental','tap'],
	'ɢ̆': [0, 'uvular','tap'],
	'ʡ̮': [0, 'pharyngeal','tap'],
	'ɾ': [0, 'alveolar','tap'],
	'ⱱ̟': [0, 'bilabial','tap'],
	'ʜ': [-1, 'pharyngeal','trill'],
	'ʢ': [1, 'pharyngeal','trill'],
	'ɽr': [0, 'retroflex','trill'],

	'ɥ': [0, 'palatal','approximant', ['labialized']],
	'ɺ': [0, 'alveolar','tap'],

	
}

const IPA_VOWELS = {
	'i': [1, 0.0, 0.0],
	'y': [1, 0.0, 0.0],
	'e': [2, 0.0, 1.0],
	'ø': [2, 0.0, 1.0],
	'ɛ': [3, 0.0, 2.0],
	'œ': [3, 0.0, 2.0],
	'a': [4, 0.0, 3.0],
	'ɶ': [4, 0.0, 3.0],
	'ɑ': [5, 2.0, 3.0],
	'ɒ': [5, 2.0, 3.0],
	'ɔ': [6, 2.0, 2.0],
	'ʌ': [6, 2.0, 2.0],
	'o': [7, 2.0, 1.0],
	'ɤ': [7, 2.0, 1.0],
	'u': [8, 2.0, 0.0],
	'ɯ': [8, 2.0, 0.0],
	'ɨ': [9, 1.0, 0.0],
	'ʉ': [9, 1.0, 0.0],
	'ɘ': [10, 1.0, 1.0],
	'ɵ': [10, 1.0, 1.0],
	'ə': [11, 1.0, 1.5],
	'ɞ': [12, 1.0, 2.0],
	'ɜ': [12, 1.0, 2.0],
	'ɪ': [13, 0.5, 0.5],
	'ʏ': [13, 0.5, 0.5],
	'ʊ': [14, 1.5, 0.5],
	'ɐ': [15, 1.0, 2.5],
	'æ': [16, 0.0, 2.5],
}

const IPA_VOWELS_CENTRAL_A = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 3.0],
}

const IPA_VOWELS_TRIANGLE = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 2.5],
	'ɶ': [4, 0.0, 2.5],
	'ɑ': [5, 2.0, 2.5],
	'ɒ': [5, 2.0, 2.5],
}

const IPA_VOWELS_FORMANT = {
	'i': [1 , 0.0 , 0.0],
	'e': [2 , 0.0 , 1.0],
	'ɛ': [3 , 0.0 , 2.0],
	'a': [4 , 0.0 , 3.0],
	'ɑ': [5 , 2.0 , 3.0],
	'ɔ': [6 , 2.0 , 2.0],
	'o': [7 , 2.0 , 1.0],
	'u': [8 , 2.0 , 0.0],
	'ɯ': [9 , 1.33, 0.0],
	'ɨ': [9 , 1.33, 0.0],
	'ɤ': [10, 1.33, 1.0],
	'ɵ': [10, 1.33, 1.0],
	'ə': [11, 1.0 , 1.5],
	'ʌ': [12, 1.33, 2.0],
	'ɞ': [12, 1.33, 2.0],
	'ɪ': [13, 0.33, 0.5],
	'ʏ': [13, 0.33, 0.5],
	'ʊ': [14, 1.66, 0.5],
	'ɐ': [15, 1.0 , 2.5],
	'æ': [16, 0.0 , 2.5],
	'ɶ': [16, 0.0 , 2.5],
	'y': [18, 0.66, 0.0],
	'ɘ': [19, 0.66, 1.0],
	'ø': [19, 0.66, 1.0],
	'œ': [20, 0.66, 2.0],
	'ɜ': [20, 0.66, 2.0],
	'ʉ': [21, 1.0 , 0.5],
	'ɒ': [22, 2.0 , 2.5],
}



const MOA_KEYWORDS = [
	['implosive','implosive',1],
	['stop','stop',-1],
	['plosive','stop',-1],
	['affricate','affricate',-1],
	['nasal','nasal',0],
	['vibrant','trill',0],
	['trill','trill',0],
	['tap','tap',0],
	['flap','tap',0],
	['fricative','fricative',-1],
	['spirant','fricative',-1],
	['approximant','approximant',0],
	['approximate','approximant',0],
	['aproximant','approximant',0],
	['aproximate','approximant',0],
	['sonorant','approximant',0],
	['glide','approximant',0],
	['ejective','ejective',-1],
]

const POA_KEYWORDS = [
	['bilabial', 'bilabial'],
	['labial', 'labial'],
	['labiodental', 'labiodental'],
	['dental', 'dental'],
	['postalveolar', 'postalveolar'],
	['alveolar', 'alveolar'],
	['retroflex', 'retroflex'],
	['alveopalatal', 'alveolo-palatal'],
	['alveolopalatal', 'alveolo-palatal'],
	['alveolo palatal', 'alveolo-palatal'],
	['palatal', 'palatal'],
	['velar', 'velar'],
	['uvular', 'uvular'],
	['pharyngeal', 'pharyngeal'],
	['glottal', 'glottal'],
	['dorsal', 'dorsal'],
	['coronal', 'coronal'],
]

const POA_MODIFIERS = [
	'palatalized',
	'labialized',
	'velarized',
	'velarized',
	'pharyngealized',
];

const MOA_MODIFIERS = [
	'prenasalized',
	'aspirated',
];

const VOICE_KEYWORDS = [
	['voiced', 1],
	['voiceless', -1],
	['unvoiced', -1],
]

const HEIGHT_KEYWORDS = [
	['near high', 0.5],
	['high mid', 1],
	['low mid', 2],
	['mid high', 1],
	['mid low', 2],
	['near low', 2.5],
	['near close', 0.5],
	['mid close', 1],
	['mid open', 2],
	['half close', 1],
	['half open', 2],
	['near open', 2.5],
	['high', 0],
	['low', 3],
	['close', 0],
	['open', 3],
	['mid', 1.5],
]

const BACKNESS_KEYWORDS = [
	['near front', 0.5],
	['near back', 1.5],
	['front', 0],
	['central', 1],
	['back', 2],
]

function splitPOAModifiers(x) {
	const mods = [];
	POA_MODIFIERS.forEach(y => {
		if (x.includes(y)) {
			x = x.replace(y, '').trim();
			mods.push(y);
		}
	});
	mods.unshift(x)
	return mods;
}


function keywords(position, settings) {
	position = position.toLowerCase().replace(/-/g, ' ');

	let x = 1, y = null;
	let moa = 'undefined', poa = 'undefined', voice = 0;
	let poamods = [];

	for (const kw of HEIGHT_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { y = kw[1]; break; }
	}
	for (const kw of BACKNESS_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { x = kw[1]; break; }
	}

	for (const kw of POA_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { poa = kw[1]; break; }
	}
	for (const kw of MOA_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) {
			moa = kw[1];
			if (kw[2]!=0) voice = kw[2];
			break;
		}
	}
	for (const kw of VOICE_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { voice = kw[1]; break; }
	}

	if (position.includes("lateral")) moa = 'lateral '+moa;
	if (!moa.includes('ejective') && position.includes("ejective")) moa = 'ejective '+moa;
	if (position.includes("aspirated")) moa = 'aspirated '+moa;
	if (position.includes("prenasalized")) moa = 'prenasalized '+moa;
	if (position.includes("prenasalised")) moa = 'prenasalized '+moa;



	if (position.includes("labialized")) poamods.push('labialized');
	if (position.includes("palatalized")) poamods.push('palatalized');
	if (position.includes("labialised")) poamods.push('labialized');
	if (position.includes("palatalised")) poamods.push('palatalized');
	
	if (position.includes("other")) return {x, y, voice, moa:'undefined', poa:'undefined', vowel: false};

	if (moa !== 'undefined' && poa !== 'undefined') return {x, y, voice, moa, poa, poamods, vowel: false};
	if (y !== null) return {x, y, voice, moa, poa, poamods, vowel: true};

	return null;
}

function getCardinalLayout(settings) {
	if (settings.layout === 'triangle')
		return IPA_VOWELS_TRIANGLE;

	if (settings.layout === 'formant')
		return IPA_VOWELS_FORMANT;

	return settings.centralLowVowel ? IPA_VOWELS_CENTRAL_A : IPA_VOWELS;
}

function parseConsonantIPA(s, settings) {
	let poamods = [];

	if (s.includes('ʷ')) poamods.push('labialized');
	if (s.includes('ʲ')) poamods.push('palatalized');
	if (s.includes('ˠ')) poamods.push('velarized');
	if (s.includes('ˤ')) poamods.push('pharyngealized');

	const voiceless = s.includes('̥') || s.includes('̊');
	const aspiration = s.includes('ʰ') || s.includes('ʱ');
	const prenasalized = /^[ᵐⁿᵑᶮᶰᶯ]/.test(s);
	let consonant = s
		.replaceAll(/[ʷʲˤˠʰʱ]/g,'')
		.replaceAll(/^[ᵐⁿᵑᶮᶰᶯ]/g,'')
		.replace('ː','')
		.replace('͡','')
		.replace('̼','')
		.replace('̊','')
		.replace('̥','')
		.replace('̥','')
		.replace('ʼ','')


	let segment = IPA_CONSONANTS[consonant];
	if (!segment) {
		segment = IPA_CONSONANTS[Object.keys(IPA_CONSONANTS).find(x => consonant.startsWith(x))??''];
	}
	if (!segment) {
		return {};
	}

	let moa = segment[2];
	let poa = segment[1];
	if (segment[3]) poamods.push(...segment[3]);
	
	if (s.includes('\u033C')) poa = 'linguo-labial';
	if (aspiration) moa = 'aspirated '+moa;
	if (prenasalized) moa = 'prenasalized '+moa;
	if (s.includes('ʼ')) moa = ('ejective '+moa).replace('ejective stop', 'ejective');

	// if (labialized)

	// if (settings.coarticulated && labialized) poa = 'labialized '+poa;
	// if (settings.coarticulated && palatalized) poa = 'palatalized '+poa;
	// if (settings.coarticulated && velarized) poa = 'velarized '+poa;
	// if (settings.coarticulated && pharyngealized) poa = 'pharyngealized '+poa;

	return {voice: voiceless ? -1 : segment[0], poa, poamods, moa};
}

function getPosition(position, settings, error) {
	if (position[0] == '(' && position.includes(',')) {
		const axis = position.slice(1, -1).split(',');
		return {x: parseFloat(axis[0]?.trim()||'0'), y: parseFloat(axis[1]?.trim()||'0'), vowel: true};
	}

	if (position[0] == '[') {
		let s = position.slice(1, -1);
		if (s[0]=='(' && s[s.length-1]==')') s = s.slice(1, -1);

		let vowel = s.normalize("NFD");
		
		const chart = getCardinalLayout(settings);

		vowel = chart[vowel[0]??''];
		if (!vowel) {
			const {voice, poa, moa, poamods} = parseConsonantIPA(s, settings);

			if (poa === undefined) return null;

			return {label: position.slice(1, -1), voice, poa, moa, poamods, vowel: false};
		}

		return {label: position.slice(1, -1), cardinal: vowel[0], x: vowel[1], y: vowel[2], vowel: true};
	}

	const kw = keywords(position, settings);
	if (!kw) {
		return null;
	}
	return kw
}


function parse(source, settings=DEFAULT_SETTINGS, error) {
	const vowels = [];

	source = source.replaceAll('ɡ','g');

	const lines = source.split('\n').filter(line => {
		// filter empty lines and comments
		if (line.trim() == '') return false;
		if (line[0] == ';') return false;

		return true;
	});

	settings.forceMerge = [];
	settings.locked = [];

	const nonCmdLines = [];

	const positionMap = {};

	for (const line of lines) {
		const titleMatch = line.match(/^# (.*)/m);
		if (titleMatch) {
			settings.title = titleMatch[1];
			continue;
		}

		const layoutMatch = line.match(/^layout (\w+)/m);
		if (layoutMatch) {
			settings.layout = layoutMatch[1]?.toLowerCase()??'trapezoid';
			continue;
		}

		const configMatch = line.match(/^config ([\w-]+) (.*)/);
		if (line.startsWith('config') && configMatch && configMatch[1]) {
			try {
				settings[configMatch[1]] = JSON.parse(configMatch[2]);
			} catch {
				error(`Invalid value in ‘${line}’`)
			}
			continue;
		}

		const mergeMatch = line.match(/^(don'?t )?(?:merge|rename)(.*)/);
		if (mergeMatch && mergeMatch[2]) {
			let [names, final] = mergeMatch[2].trim().split(' as ');
			names = names.split(',').map(x => x.trim());
			if (names.length == 0) continue;
			if (mergeMatch[1] && final == undefined) {
				settings.locked.push(...names);
			} else if (mergeMatch[1] == undefined && final != undefined) {
				settings.forceMerge.push([names, final])
			}
			continue
		}

		const match = line.match(/^add\s+(?:(?:dot\s+)?(left|right))?\s*(\[[^\]]+\]|\([^)]+\)|[^"]+)\s*(?:"([^"]*)")?/m);
		if (!match) {
			nonCmdLines.push(line);
			continue;
		}

		const dot = match[1]??'middle';
		const position = getPosition(match[2]??'', settings, error);
		let label = match[3];

		if (!position) {
			error(`Invalid position ‘${match[2]}’`);
			vowels.push({label, vowel: false, voice: 0, moa: 'undefined', poa: 'undefined'});
			continue;
		}

		if (label === undefined) {
			if (!position.label) {
				error(`Error rendering line ‘${line}’: Missing label`);
				continue;
			}
			label = position.label;
		}

		if (position.cardinal && dot=='middle') {
			const cardinal = positionMap[position.cardinal];
			if (cardinal) {
				cardinal.text.push(label);
			} else {
				positionMap[position.cardinal] = {x: position.x, y: position.y, text:[label]};
			}
			continue;
		}

		vowels.push({
			...position,
			label, plabel: position.label, vowel: position.vowel, x: position.x, y: position.y, dot, 
			// voice: position.voice, moa: position.moa, poa: position.poa,
			// poa: position.poamods,
		});
	}

	

	nonCmdLines.join(' ').split(/[\s,]+/g)
		.forEach(v => {
			if (!v.trim()) return;
			const p = getPosition(`[${v}]`, settings, error);
			if (!p) {
				vowels.push({label: v, vowel: false, voice: 0, moa: 'undefined', poa: 'undefined'});
				return;
			}
			if (!p.cardinal) {
				vowels.push({...p, label: v, plabel: p.label, vowel: p.vowel, x: p.x, y: p.y, dot: 'middle', 
					// voice: p.voice, moa: p.moa, poa: p.poa
				});
				return;
			}
			const cardinal = positionMap[p.cardinal];
			if (cardinal) {
				cardinal.text.push(v);
			} else {
				positionMap[p.cardinal] = {x: p.x, y: p.y, text:[v]};
			}
		});

	for (const cardinal in positionMap) {
		const v = positionMap[cardinal];

		vowels.push({label: v.text.join(' '), x: v.x, y: v.y, dot: 'middle', vowel: true});
	}

	// vowels.forEach(x => {
	// 	if (x.poa) x.poa2 = splitPOAModifiers(x.poa)
	// })

	return vowels;
}