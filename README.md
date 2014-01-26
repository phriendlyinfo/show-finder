## show-finder

Find all Phish shows in given a date range.

## Obtainage

`npm install show-finder`

## Module Interface

#### find(options, callback) → undefined

* `options` {Object} - [required] date and apikey options
  * `from` {String|Number} - [optional] the start date. Can be a string in the form 'YYYY', 'YYYY-MM', 'YYYY-MM-DD' or a four digit number representing a year. If not supplied, will default to the earliest possible year, which is 1983.
  * `to` {String|Number} - [optional] the start date. Can be a string in the form 'YYYY', 'YYYY-MM', 'YYYY-MM-DD' or a four digit number representing a year. If not supplied, will default to the current date
  * `pnetApikey` {String} - [required] your pnet API key to be passed to [pnet module](https://github.com/benjreinhart/pnet)
* `callback` {Function} - [required] the function to be called when the requests complete. It will be passed two arguments, the first being an error if one occurred or `null`, the second being an object whose keys are years mapped to an array of shows.

## Examples

```javascript
var showFinder = require('show-finder');
showFinder.find({from: 2009, to: 2011, pnetApikey: '123'}, function(err, shows){
  console.log(shows['2009']); // array of shows in 2009
  console.log(shows['2010']); // array of shows in 2010

  console.log(shows['2011']);
  /**
   * Careful, the above is `undefined` since the date range is exclusive if the `to` date lies on the
   * first of the year (which it defaults to if the date is just a year and not a fully qualified date string).
   */
});

showFinder.find({from: '2013-10', to: '2013-11-2', pnetApikey: '123'}, function(err, shows){
  console.log(shows['2013']) // array of shows in october of 2013 up till (and including november 2nd).
});
```

## License

[MIT](https://github.com/phriendlyinfo/show-finder/blob/master/LICENSE.txt)
