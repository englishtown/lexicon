{var ast = [], tags = [], texts = [], comment = {}, func = {};}

start
	= doc*
		{return ast;}

doc
	= comment func?
		{ast.push({comment:comment, function:func});}

comment
	= "/*" "*"* whitespace* commentBody:commentBody "*/" whitespace*
		{comment['tags'] = tags; comment['text'] = texts.join("\n").trim();}

commentBody 
	= line:commentLine*

commentLine
	= commentLineStart? spacetab* "@" tag:tag
		{tags.push(tag);}
	/ commentLineStart? spacetab* t:[0-9a-zA-Z\. ]* newline
		{texts.push(t.join(''));}
	/ commentLineStart !"/" whitespace*

tag
	= "return" spacetab+ type:varType desc:tagDescription? whitespace*
		{return {tag:'return', type:type, description:desc};}
	/ "param" spacetab+ type:varType spacetab+ value:chars desc:tagDescription whitespace*
		{return {tag:'param', value:value, type:type, description:desc};}
	/ tag:chars spacetab+ value:chars whitespace*
		{return {tag: tag, value:value};}
	/ tag:chars whitespace*
		{return {tag: tag};}

varType
	= "{" type:chars "}"
		{return type;}

tagDescription
	= spacetab+ char:[0-9a-zA-Z.-_\t ]+
		{return char.join('');}

commentLineStart
	= spacetab* "*"

func
	= "function" space+ name:chars "(" args:arglist* ")" "{" "}" whitespace*
		{ func = {name: name, args:args};}

arglist
	= arg:chars ("," space*)? { return arg;}

whitespace
	= space
	/ tab
	/ newline

spacetab
	= space
	/ tab

space
	= " "

tab
	= "\t"

newline
	= "\n"

chars
	= char:[0-9a-zA-Z]+
		{return char.join('');}