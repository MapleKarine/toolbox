CodeMirror.defineSimpleMode("simplemode", {
	start: [
		{regex: /;.*/, token: 'comment', sol: true },
		{regex: /(# )(.*)/, token: ['def', 'string'], sol: true },
		{regex: /(config)\b/, token: 'def', push: 'config' },
		{regex: /(don'?t )?merge\b/, token: 'def', sol: true },
		{regex: /\b(add|layout|as|rename)\b/, token: 'def' },
		{regex: /\b(pre)?(stop|affricate|lateral|nasal|trill|tap|fricative|approximant|ejective|(im)?plosive|aspirated)(ized|ised)?\b/, token: 'tag' },
		{regex: /\b(post)?((bi)?labial|(labio)?dental|alveolar|retroflex|alveolo|alveo(lo)?palatal|palatal|velar|uvular|pharyngeal|(epi)?glottal)(ized|ised)?\b/, token: 'tag' },
		{regex: /\b(voiceless|(un)?voiced)\b/, token: 'tag' },
		{regex: /\b(near|high|mid|low|open|close|back|front|central|(un)?rounded)\b/, token: 'tag' },

		{regex: /"[^"]+"/, token: "string" },
	],
	config: [
		{regex: /\d+/, token: "number", pop: true },
		{regex: /\b(true|false)\b/, token: "number", pop: true },
	],
	meta: {
		dontIndentStates: ["comment"],
		lineComment: ";"
	}
});
  