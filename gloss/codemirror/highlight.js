const STYLES = [...'0123456789']

const tokens = STYLES.map(p => ({regex: new RegExp(`\\([^()]+\\)${p}`), token: "hl"+p[0] }))

CodeMirror.defineSimpleMode("simplemode", {
	start: [
		...tokens,
		// {regex: /(\([^()]+\)\d?)/, token: "hr" },
		// {regex: /\\\\/, token: "hr" },
		{regex: /[!*>] /, token: "def", sol: true },
	],

	meta: {
		// dontIndentStates: ["comment"],
		// lineComment: "#"
	}
});
  