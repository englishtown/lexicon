{var name}
start
	= sig*
		{return name;}
sig
	= st* "function" st* n:name st* tokens+
		{name = n;}
	/ st* "var" st* n:name st* tokens+
		{name = n;}
	/ st* n:name st* tokens+
		{name = n;}
	/ tokens+

name
	= chars:[0-9a-zA-Z_.]+
		{return chars.join('')}

tokens
	= [0-9a-zA-Z(){},_.=[\]\"\'-:+!$]
	/ "\\"
	/ st
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