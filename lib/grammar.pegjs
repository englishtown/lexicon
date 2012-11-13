{var ast=[], lines = [], tags = [], texts = [], funclines = []}

start
	= block*
		{return ast;}

block
	= commentBlock
		{texts = []; tags = [];}
	/ functionBlock
	/ nl

commentBlock
	= commentStart c:commentBody* e:commentEnd
		{ast.push({comment: {tags: tags, text:texts.join("\n").trim()}, function: e.trim()});}
	/ ignoreCommentStart [0-9a-zA-Z\,\.\-\_\?\!: ]* commentEnd
	/ commentStart [0-9a-zA-Z\,\.\-\_\?\! ]* commentEnd
	/ ignoreCommentStart commentBody* commentEnd

commentBody
	= commentLineStart "@" tag:commentTag st* nl
		{tags.push(tag);}
	/ commentLineStart w:words st* nl
		{texts.push(w);}
	/ commentLineStart w:markdown st* nl
		{texts.push(w)}
	/ commentLineStart nl
		{texts.push('');}
	/ c:commentTokens+ nl

commentLineStart
	= st* "*" st*

commentTag
	= 'return' st* type:commentVarType st* desc:words
		{return {tag: 'return', type:type, description: desc};}
	/ chars:alphanum+ st* type:commentVarType st* name:word st* desc:words?
		{return {tag: chars.join(''), type: type, value: name, description: desc};}
	/ "return" st* type:commentVarType st* desc:words+
		{return {tag: 'return', description: desc};}
	/ chars:alphanum+ st* name:words+
		{return {tag: chars.join(''), value: name.join('')}}
	
	/ chars:alphanum+
		{return {tag: chars.join('')};}

commentVarType
	= "{" type:alphanum+ "}"
		{return type.join('');}

ignoreCommentStart
	= st* ignoreCommentStartTag st* nl?

ignoreCommentEnd
	= st* commentEndTag st* nl?

commentStart
	= st* commentStartTag st* nl?

commentEnd
	= st* commentEndTag ws* t:functionSig nl?
		{return t;}
	/ st* commentEndTag st* nl? t:functionTokens* nl?
		{return t.join('');}


commentStartTag
	= "/**"

ignoreCommentStartTag
	= "/***"
	/ "/*!"
	/ "/*"

commentEndTag
	= "*/"

ignoreComments
	= commentLineStart w:markdown st* nl

ignoreCommentTokens
	= !("*") "/"
	/ "//"
	/ "/"
	/ &([a-zA-Z]) "/" &([a-zA-Z])
	/ [0-9a-zA-Z(){}\t,.;=+[\]\-\*?:"'^!%~<>#\\@_|& ]

commentTokens
	= [0-9a-zA-Z\@\.\,\{\}\#\-():<>|&]
	/ !("*") "/"
	/ &([a-zA-Z]) "/" &([a-zA-Z])
	/ "//"
	/ "*" !("/")
	/ space
	/ tab

functionBlock
	= functionSig? nl? functionLines

functionSig
	= "define" st* "(" st* "[" words* "]" st* "," st* "function" st* w:word st* "(" words* ")" st* "{"
		{return w;}
	/ st* "var" st+ s:word st* "=" st* "function" st* word? st* "(" words* ")" st* "{"
		{return s;}
	/ st* s:word st* "=" st* "function" st* word? st* "(" words* ")" st* "{"
		{return s;}
	/ st* "function" st+ w:word st* "(" words* ")" st* "{"
		{return w;}

functionLines
	= l:functionLine
		{funclines.push(lines[0]); lines = [];}

functionLine
	= l:functionTokens+ nl?
		{lines.push(l.join(''));}

functionTokens
	= [0-9a-zA-Z(\){}\t\,.;=+\[\]\-\*?:"'^!%~<>#\\@_$|& ]
	/ "/" !("*")

markdown
	= chars:markdownTokens+
		{return chars.join('');}

markdownTokens
	= wordTokens
	/ "*"
	/ st

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
	/ [.,_\-\$<>@]


alphanum
	= [0-9a-zA-Z]

ws
	= st
	/ nl

st
	= space
	/ tab

space
	= " "

tab
	= "\t"

nl
	= "\n"