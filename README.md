# lexicon

api documentation generator

## Getting Started
Install the module with: `npm install lexicon`

Using from the commandline

```bash
lexicon file1.js file2.js file3.js > doc.json
```

Using the API

```javascript
var lexicon = require('lexicon').parser;
lexicon.parse(code);
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Testing
Testing is done using [buster](http://busterjs.org) thru [grunt-buster](https://github.com/thedersen/grunt-buster) plugin.

`grunt buster` or simply `grunt` which will run the code with lint.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 kates  
Licensed under the MIT license.
