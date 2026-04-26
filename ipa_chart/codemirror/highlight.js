const moakws = {regex: /\b(stop|affricate|lateral|nasal|trill|tap|fricative|approximant|ejective|(im)?plosive|sonorant|click)\b/i, token: 'tag' }
const moa2kws = {regex: /\b(pre)?(lateral|nasal|aspirated|breathy)(ized|ised)?\b/i, token: 'tag' }
const poakws = {regex: /\b((bi)?labial|(labio)?dental|(post)?alveol(ar|o)|sibilant|retroflex|alveo(lo)?palatal)\b/i, token: 'tag' }
const poa2kws = {regex: /\b(labial|alveolar|palatal|velar|uvular|pharyngeal|(epi)?glottal)(ized|ised)?\b/i, token: 'tag' }

CodeMirror.defineSimpleMode("simplemode", {
	start: [
		{regex: /;.*/, token: 'comment', sol: true },
		{regex: /(# )(.*)/, token: ['def', 'string'], sol: true },
		{regex: /(config)\b/, token: 'def', push: 'config', sol: true },
		{regex: /(don'?t )?merge\b/, token: 'def', sol: true },
		{regex: /(col|row)\(/, token: 'def', push: 'customCell' },
		moakws,
		moa2kws,
		poakws,
		poa2kws,
		{regex: /\b(voiceless|(un)?voiced)\b/, token: 'tag' },
		{regex: /\b(other)\b/, token: 'tag' },
		{regex: /\b(near|high|mid|low|open|close|back|front|central|(un)?rounded)\b/, token: 'tag' },
		{regex: />/, token: "def" },
		{regex: /"[^"]+"/, token: "string" },
		{regex: /\b(?:add|layout|as|rename|voicing|ignore)\b/, token: 'def' },
		{regex: /[a-z][\w]*/, token: null},
	],
	config: [
		{regex: /\d+/, token: "number", pop: true },
		{regex: /\b(true|false)\b/, token: "number", pop: true },
	],
	customCell: [
		moakws,
		moa2kws,
		poakws,
		poa2kws,
		{regex: />/, token: "def" },
		{regex: /\)/, token: "def", pop: true},
	],
	meta: {
		dontIndentStates: ["comment"],
		lineComment: ";"
	}
});
  