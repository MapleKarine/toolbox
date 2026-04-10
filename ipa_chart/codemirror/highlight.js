CodeMirror.defineSimpleMode("simplemode", {
	start: [
		{regex: /;.*/, token: 'comment', sol: true },
		{regex: /(config)\b/, token: 'def', push: 'config' },
		{regex: /\b(add|layout)\b/, token: 'def' },
		{regex: /\b(pre)?(stop|affricate|lateral|nasal|trill|tap|fricative|approximant|ejective|(im)?plosive|aspirated)(ized)?\b/, token: 'tag' },
		{regex: /\b(post)?((bi)?labial|(labio)?dental|alveolar|retroflex|alveolo|alveolopalatal|palatal|velar|uvular|pharyngeal|(epi)?glottal)(ized)?\b/, token: 'tag' },
		{regex: /\b(voiceless|(un)?voiced)\b/, token: 'tag' },
		{regex: /\b(near|high|mid|low|open|close|back|front|central|(un)?rounded)\b/, token: 'tag' },

		{regex: /"[^"]+"/, token: "string" },
	],
	config: [
		{regex: /\d+/, token: "number", pop: true },
		{regex: /\b(true|false)\b/, token: "number", pop: true },
	],

	meta: {
		// dontIndentStates: ["comment"],
		lineComment: ";"
	}
});
  