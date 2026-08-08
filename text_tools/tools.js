const FormatResults = {
	array(data, sep='\n') { return data.join(sep); },
	object(data, sep=': ') { return Object.entries(data).map(([key, value]) => `${key}${sep}${value}`).join('\n'); },
}

const WORD_RE = /[\p{L}\p{N}_']+/gu;
const LINE_RE = /\r?\n/;

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const TextTools = {
	characterCount(text) {
		return [...text].length;
	},

	wordCount(text) {
		const words = text.match(WORD_RE);
		return words ? words.length : 0;
	},
	
	lineCount(text) {
		if (!text) return 0;
		return text.split(/\r?\n/).length;
	},

	count(text, by, regex=null) {
		return {
			characters: TextTools.characterCount,
			words: TextTools.wordCount,
			lines: TextTools.lineCount,
		}[by]?.(text, regex) ?? '';
	},


	uniqueWords(text) {
		return [...new Set(
			(text.match(WORD_RE) || [])
		)];
	},

	uniqueCharacters(text) {
		return [...new Set(text)];
	},

	uniqueLines(text) {
		return [...new Set(text.split(/\r?\n/))];
	},

	unique(text, by) {
		return {
			characters: TextTools.uniqueCharacters,
			words: TextTools.uniqueWords,
			lines: TextTools.uniqueLines,
		}[by]?.(text) ?? [];
	},


	characterFrequency(text) {
		const freq = {};

		for (const c of text)
			freq[c] = (freq[c] || 0) + 1;

		delete freq['\n'];

		return freq;
	},

	wordFrequency(text) {
		const freq = {};

		const words = text
			.match(WORD_RE) || [];

		for (const word of words)
			freq[word] = (freq[word] || 0) + 1;

		return freq;
	},

	lineFrequency(text) {
		const freq = {};

		const lines = text.split(/\r?\n/);

		for (const line of lines)
			freq[line] = (freq[line] || 0) + 1;

		return freq;
	},

	frequency(text, by, reverse) {
		const freq = {
			characters: TextTools.characterFrequency,
			words: TextTools.wordFrequency,
			lines: TextTools.lineFrequency,
		}[by]?.(text) ?? {};

		const sorted = Object.entries(freq).sort((a,b) => reverse?(b[1]-a[1]):(a[1]-b[1]));

		return Object.fromEntries(sorted);
	},

	sortLines(text, by, reverse) {
		const fn = by == 'length'
			? (a, b) => a.length - b.length
			: (a, b) => a.localeCompare(b);

		return text.split(LINE_RE).sort((a,b) => reverse ? fn(b,a) : fn(a,b));
	},

	sortWords(text, by, reverse) {
		const fn = by == 'length'
			? (a, b) => a.length - b.length
			: (a, b) => a.localeCompare(b);

		return (text.match(WORD_RE) || [])
			.sort((a,b) => reverse ? fn(b,a) : fn(a,b));
	},

	shuffle(text, by) {
		if (by=='lines') return shuffle(text.split(LINE_RE)).join('\n')
		if (by=='words') {
			const words = [...text.matchAll(WORD_RE)];
			shuffle(words);
			let i = 0;
			return text.replaceAll(WORD_RE, (m) => words[i++]);
		}
		if (by=='characters') {
			return text.replaceAll(WORD_RE, (m) => shuffle([...m]).join(''));
		}
		if (by=='obfuscate') {
			const b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			return text.replaceAll(WORD_RE, (m) => [...m].map(x=>b62[~~(Math.random()*62)]).join(''));
		}
	},

	prefixes(text, by, length) {
		const fn = x => [...x].slice(0,length).join("");
		if (by=='lines') return text.split(LINE_RE).map(fn).filter(x=>x.length).join('\n')
		if (by=='words') {
			const words = text.match(WORD_RE) || [];
			return words.map(fn).filter(x=>x.length).join('\n');
		}
	},

	suffixes(text, by, length) {
		const fn = length >= 0 
			? (x => [...x].slice(Math.max(0,x.length-length)).join("")) 
			: (x => [...x].slice(-length).join(""));
		if (by=='lines') return text.split(LINE_RE).map(fn).filter(x=>x.length).join('\n')
		if (by=='words') {
			const words = text.match(WORD_RE) || [];
			return words.map(fn).filter(x=>x.length).join('\n');
		}
	},

	wordNgrams(text, n, punctuation) {
		const SENTENCE_RE = punctuation ? /[^.?!;]+[.?!;]/g : /[^.?!;]+/g;
		const sentences = text.match(SENTENCE_RE);

		const ngrams = [];

		for (let s of sentences) {
			if(punctuation) {
				s = s.replace(/([.?!;])/, ' $1');
			}
			s = s.replace(/([^\w]*-[^\w])+|[\s,:]+/g, ' ')
				.trim()
				.split(/\s+/g);


			for (let i = 0; i < s.length-n+1; i++) {
				let gram = '';
				for(let l = 0; l < n; l++){
					gram += s[i+l] + ' ';
				}
				gram = gram.trim();

				ngrams.push(gram);
			}
		}
		
		return ngrams.join('\n');
	},

	characterNgrams(text, n, punctuation, whitespace) {
		const ngrams = [];

		if (whitespace) {
			text = [...text];
			for (let i = 0; i < text.length-n+1; i++) {
				let gram = '';
				for(let l = 0; l < n; l++){
					gram += text[i+l];
				}
				ngrams.push(gram);
			}
			return ngrams.join('\n');
		}

		const W_RE = punctuation ? /[^.?!;,:\s]+[.?!;,:]/g : /[^.?!;,:\s]+/g;
		const words = text.match(W_RE);

		

		for (let s of words) {
			s = [...s];

			for (let i = 0; i < s.length-n+1; i++) {
				let gram = '';
				for(let l = 0; l < n; l++){
					gram += s[i+l];
				}
				ngrams.push(gram);
			}
		}
		
		return ngrams.join('\n');
	},


	find(text, regex) {
		const match = text.match(regex);
		if (!match) return '';
		return match[0];
	},

	replace(text, regex, replace) {
		return text.replaceAll(regex, replace);
	},

	eachLine(text, fn) {
		return text.split(LINE_RE).map(fn).join('\n');
	},

	findIndex(text, regex, start=0, end=false) {
		const m = text.slice(start).match(regex);
		if (end) {
			if (!m) return 0;
			return start+m.index+m[0].length;
		}
		if (!m) return text.length;
		return start+m.index;
	},

	shannon(text) {
		const len = text.length;
		if (len === 0) return 0;
		const chars = [...text];
		
		const frequencies = [...new Set(chars)].map(chr =>
			chars.filter(c => c === chr).length
		);
		
		return frequencies.reduce((sum, freq) => {
			const p = freq / len;
			return sum - (p * Math.log2(p));
		}, 0);
	},

	duplicateCharacters(text, count) {
		const fn = count < 0 
			? (key => freq[key] == -count)
			: (key => freq[key] >= count)

		const freq = {};

		for (const c of text)
			freq[c] = (freq[c] || 0) + 1;

		delete freq['\n'];

		return Object.keys(freq).filter(fn).join('');
	},

	duplicateWords(text, count) {
		const fn = count < 0 
			? (key => freq[key] == -count)
			: (key => freq[key] >= count)

		const freq = {};

		const words = text
			.match(WORD_RE) || [];

		for (const word of words)
			freq[word] = (freq[word] || 0) + 1;

		return Object.keys(freq).filter(fn).sort((a, b) => freq[b] - freq[a]).join(' ');
	},

	duplicateLines(text, count) {
		const fn = count < 0 
			? (key => freq[key] == -count)
			: (key => freq[key] >= count)

		const freq = {};

		const lines = text.split(/\r?\n/);

		for (const line of lines)
			freq[line] = (freq[line] || 0) + 1;

		return Object.keys(freq).filter(fn).join('\n');
	},

	duplicate(text, by, count=2) {
		return {
			characters: TextTools.duplicateCharacters,
			words: TextTools.duplicateWords,
			lines: TextTools.duplicateLines,
		}[by]?.(text, count) ?? '';
	},







	averageWordLength(text) {

		const words = text.match(WORD_RE);

		if (!words) return 0;

		return words.reduce((a, b) => a + b.length, 0) / words.length;
	},


	reverseText(text) {
		return [...text].reverse().join("");
	},

	reverseWords(text) {
		return text.split(/\s+/).reverse().join(" ");
	},

	



	// duplicateWords(text) {

	// 	const freq = this.wordFrequency(text);

	// 	return Object.entries(freq)
	// 		.filter(([_, count]) => count > 1)
	// 		.sort((a, b) => b[1] - a[1]);
	// },

	// duplicateLines(text) {

	// 	const freq = {};

	// 	for (const line of text.split(/\r?\n/))
	// 		freq[line] = (freq[line] || 0) + 1;

	// 	return Object.entries(freq)
	// 		.filter(([_, c]) => c > 1);
	// },
};