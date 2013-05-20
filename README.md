# lexicon

api documentation generator

[![Build Status](https://travis-ci.org/englishtown/lexicon.png)](https://travis-ci.org/englishtown/lexicon)

## Getting Started
Install the module with: `npm install lexicon`

Using from the commandline

```bash
lexicon file1.js file2.js file3.js -f json > doc.json
lexicon file1.js file2.js file3.js -f markdown > doc.md
lexicon -i src -o docs -f markdown
```

Using the API

```javascript
var lexicon = require('lexicon'),
	parser = lexicon.parser,
	formatter = lexicon.formatter;
console.log(formatter.format(parser.parse(code), 'markdown'));
```

## Documentation
_(Coming soon)_

## Testing
Testing is done using [buster](http://busterjs.org) thru [grunt-buster](https://github.com/thedersen/grunt-buster) plugin.

`grunt buster` or simply `grunt` which will run the code with lint.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
**0.2.11**
fixed missing square brackets in optional params


## License
Copyright (c) 2012 kates  
Licensed under the MIT license.
