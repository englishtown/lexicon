start
	= doc*

doc
	= comment:comment func:func?
		{return {comment:comment, function:func};}

comment
	= "/*" "*"* whitespace* commentBody:commentBody "*/" whitespace*
		{return commentBody;}

commentBody
	= line:commentLine*
		{var lines = []; for(var i=0;i<line.length; i++) {line[i] && lines.push(line[i]);} return {tags: lines};}

commentLine
	= commentLineStart? spacetab* tag:tag
		{return tag;}
	/ commentLineStart !("/") whitespace*
		{return false;}

tag
	= "@return" spacetab+ type:varType desc:tagDescription? whitespace*
		{return {tag:'return', type:type, description:desc};}
	/ "@param" spacetab+ type:varType spacetab+ value:chars desc:tagDescription whitespace*
		{return {tag:'param', value:value, type:type, description:desc};}
	/ "@" tag:chars spacetab+ value:chars whitespace*
		{return {tag: tag, value:value};}

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
		{ return {name: name, args:args};}

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