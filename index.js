var async = require('async')
  , pnet = require('pnet')
  , toString = {}.toString;

var yearRange = (function(accum, start, end){
  for(var i = start; i < end; i++) accum.push(i);
  return accum.concat(i);
}([], 1983, new Date().getFullYear()));

exports.find = function(options, cb) {
  var from = normalizeDate(options.from || '1983')
    , to = normalizeDate(options.to);

  if (!(isValidDate(from) || isValidDate(to))) {
    process.nextTick(cb.bind(null, dateRangeError()));
    return
  }

  var showsQuery = buildShowsQueryObj(from, to, options.pnetApikey);
  async.parallel(showsQuery, function(err, shows){
    if (null != err)
      cb(err);
    else
      cb(null, filterShowsByDate(from, to, shows));
  });
}

function buildShowsQueryObj(from, to, apikey){
  return yearRange.filter(function(year){
    var exclusive = false;
    if (to.month === 1 && to.day === 1) {
      exclusive = true;
    }
    return from.year <= year && (exclusive ? year < to.year : year <= to.year);
  }).reduce(function(memo, year){
    memo[year] = function(cb) {
      pnet.get('shows.query', {year: year, apikey: apikey}, function(err, _, shows){
        cb(err, shows)
      });
    }
    return memo;
  }, {});
}

function filterShowsByDate(from, to, shows){
  return Object.keys(shows).reduce(function(memo, year){
    memo[year] = shows[year].reduce(function(accum, show){
      var date = convertDateStringToDateObject(show.showdate);

      if (olderOrEqualTo(from, date) && olderOrEqualTo(date, to)){
        accum.push(show);
      }

      return accum;
    }, []);
    return memo;
  }, {});
}


/**
 * Custom date helpers
 */

function isValidDate(date){
  return yearRange[0] <= date.year && date.year <= yearRange[yearRange.length - 1];
}

function dateRangeError(){
  return new Error("Supplied date range must be between 1983 and " + new Date().getFullYear());
}

function normalizeDate(date){
  switch ({}.toString.call(date)) {
    case '[object String]':
      return convertDateStringToDateObject(date)
    case '[object Number]':
      return convertYearToDateObject(date)
    case '[object Null]':
    case '[object Undefined]':
      return buildDateObject()
  }
}

function buildDateObject(year){
  var date = year != null ? new Date(year, 0) : new Date;

  return {
    year: date.getFullYear(),
    month: (date.getMonth() + 1),
    day: date.getDate()
  }
}

function convertYearToDateObject(year) {
  return {
    year: +year,
    month: 1,
    day: 1
  }
}

function convertDateStringToDateObject(dateString){
  var dateValues = dateString.split('-');

  return {
    year: +dateValues[0],
    month: +(dateValues[1] || 1),
    day: +(dateValues[2] || 1)
  }
}

function olderOrEqualTo(date1, date2) {
  date1 = new Date(date1.year, date1.month - 1, date1.day);
  date2 = new Date(date2.year, date2.month - 1, date2.day);
  return date1 < date2;
}
