{var ast, tags = [], text = []}

start
	= block
		{return ast}

block
	= nl comment+
	/ "*" nl comment+
		{ast = {tags: tags, text: text.join("\n").trim()}; text = []; tags = []}
	/ [*!] ws+ comment+
	/ comment+

comment
	= st* "*" st* t:tags nl?
		{tags.push(t)}
	/ st* "*" st? s:st* c:tokens+ nl?
		{text.push(s.join('') + c.join(''))}
	/ st* "*" st* nl
		{text.push('')}
	/ chars:tokens+ nl?

tags
	= "@return" "s"? st+ "{" t:varType "}" st+ desc:tokens+
		{return {tag: "return", type: t, description: desc.join('')}}
	/ "@param" st+ "{" t:varType "}" st+ "[" st* v:identifier st* "]" st+ desc:tokens*
		{return {tag: "param", type: t, value: v, description: desc.join(''), optional: true}}
	/ "@param" st+ "{" t:varType "}" st+ v:identifier st+ desc:tokens*
		{return {tag: "param", type: t, value: v, description: desc.join('')}}
	/ "@param" st+ v:varType st+ desc:tokens*
		{return {tag: "param", value: v, description: desc.join('')}}
	/ "@" n:identifier st+ "{" t:varType "}" st+ desc:tokens+
		{return {tag: n, type: t, description: desc.join('')}}
	/ "@" n:identifier st+ desc:tokens+
		{return {tag: n, value: desc.join('')}}
	/ "@" n:identifier
		{return {tag: n}}
tokens
	= [0-9a-zA-Z!@#$%^&*(){}[\]!*.,-<>="'+$|_\?]
	/ "\\"
	/ st
	/ "`"
	/ "\xA9"

varType
	= t:varTypeTokens*
		{return t.join('')}

varTypeTokens
	= [0-9a-zA-Z?|[\].]

identifier
	= alphanum

alphanum
	= chars:[0-9a-zA-Z]+
		{return chars.join('')}

ws
	= st
	/ nl

st
	= space
	/ tab

nl
	= "\n"
	/ "\u2019"

space
	= " "

tab
	= "\t"
