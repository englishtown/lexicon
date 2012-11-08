{var ast=[], lines = [], tags = [], texts = [], funclines = [], node = {};}

start
	= block*
		{return ast;}

block
	= commentBlock
	/ functionBlock
	/ nl

commentBlock
	= commentStart c:commentBody* e:commentEnd
		{ast.push({comment: {tags: tags, text:texts.join("\n").trim()}, function: e.trim()}); tags = []; texts = [];}
	/ commentStart [0-9a-zA-Z ]* commentEnd

commentBody
	= commentLineStart "@" tag:commentTag st* nl
		{tags.push(tag);}
	/ commentLineStart w:words st* nl
		{texts.push(w);}
	/ commentLineStart nl
		{texts.push('');}
	/ c:commentTokens+ nl

commentLineStart
	= st* "*" st*

commentTag
	= 'return' st* type:commentVarType st* desc:words
		{return {tag: 'return', type:type, description: desc};}
	/ chars:alphanum+ st* type:commentVarType st* name:word st* desc:words
		{return {tag: chars.join(''), type: type, value: name, description: desc};}
	/ "return" st* type:commentVarType st* desc:words+
		{return {tag: 'return', description: de};}
	/ chars:alphanum+ st* name:word
		{return {tag: chars.join(''), value: name};}
	/ chars:alphanum+
		{return {tag: chars.join('')};}

commentVarType
	= "{" type:alphanum+ "}"
		{return type.join('');}

commentStart
	= st* commentStartTag st* nl?

commentEnd
	= st* commentEndTag st* nl+ t:functionTokens* nl?
		{return t.join('');}

commentStartTag
	= "/" "*"+

commentEndTag
	= "*/"

commentTokens
	= [0-9a-zA-Z\@\.\,\{\}\#\-]
	/ "*"
	/ space
	/ tab

functionBlock
	= functionLines
		{}

functionLines
	= l:functionLine
		{funclines.push(lines[0]); lines = [];}

functionLine
	= l:functionTokens+ nl?
		{lines.push(l.join(''));}

functionTokens
	= [0-9a-zA-Z(){}\t,.;=+[\]\-\*?:"'^!%~<> ]
	/ "/" !("*")

words
	= chars:wordsTokens+
		{return chars.join('');}

wordsTokens
	= word
	/ st

word
	= chars:wordTokens+
		{return chars.join('');}

wordTokens
	= alphanum
	/ [.,_\-]


alphanum
	= [0-9a-zA-Z]

st
	= space
	/ tab

space
	= " "

tab
	= "\t"

nl
	= "\n"