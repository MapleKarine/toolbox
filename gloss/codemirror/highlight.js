const STYLES = [...'0123456789']

const tokens = STYLES.map(p => ({regex: new RegExp(`\\([^()]+\\)${p}`), token: "hl"+p[0] }))

CodeMirror.defineSimpleMode("simplemode", {
	start: [
		...tokens,
		// {regex: /(\([^()]+\)\d?)/, token: "hr" },
		// {regex: /\\\\/, token: "hr" },
		{regex: /(\{)([A-Z0-9.>-]+)(\:[^}]*)?(\})/, token: [null, "tag", null, null] },
		{regex: /\-\-+/, token: "hr", sol: true },
		{regex: /\&null\;|\_\_/, token: "string-2"},
		{regex: /(\()?(\(\()|(\)\))(\))?/, token: [null, "string-2", "string-2", null]},
		{regex: /\(\d+\)\s/, token: "def", sol: true },
		{regex: /[!*>#]\s/, token: "def", sol: true },
	],

	meta: {
		// dontIndentStates: ["comment"],
		// lineComment: "#"
	}
});
  