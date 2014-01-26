var expect = require('chai').expect
  , pnet = require('pnet')
  , sinon = require('sinon')
  , showFinder = require('../');

var s2012 = [
  {
      "showid": "1349228977",
      "showdate": "2012-12-28",
      "showyear": "2012",
      "artist": "Phish",
      "venue": "Madison Square Garden",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "venueid": "157",
      "meta": "",
      "nicedate": "December 28, 2012",
      "relativetime": "1 year ago",
      "link": "http://phish.net/setlists/?d=2012-12-28"
  },
  {
      "showid": "1349228993",
      "showdate": "2012-12-29",
      "showyear": "2012",
      "artist": "Phish",
      "venue": "Madison Square Garden",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "venueid": "157",
      "meta": "",
      "nicedate": "December 29, 2012",
      "relativetime": "1 year ago",
      "link": "http://phish.net/setlists/?d=2012-12-29"
  },
  {
      "showid": "1349229009",
      "showdate": "2012-12-30",
      "showyear": "2012",
      "artist": "Phish",
      "venue": "Madison Square Garden",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "venueid": "157",
      "meta": "",
      "nicedate": "December 30, 2012",
      "relativetime": "1 year ago",
      "link": "http://phish.net/setlists/?d=2012-12-30"
  },
  {
      "showid": "1349229036",
      "showdate": "2012-12-31",
      "showyear": "2012",
      "artist": "Phish",
      "venue": "Madison Square Garden",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "venueid": "157",
      "meta": "",
      "nicedate": "December 31, 2012",
      "relativetime": "1 year ago",
      "link": "http://phish.net/setlists/?d=2012-12-31"
  }
]


var s2013 = [
  {
      "showid": "1363194699",
      "showdate": "2013-07-03",
      "showyear": "2013",
      "artist": "Phish",
      "venue": "Darling's Waterfront Pavilion",
      "city": "Bangor",
      "state": "ME",
      "country": "USA",
      "venueid": "1274",
      "meta": "",
      "nicedate": "July 03, 2013",
      "relativetime": "5 months ago",
      "link": "http://phish.net/setlists/?d=2013-07-03"
  },
  {
      "showid": "1363195146",
      "showdate": "2013-07-05",
      "showyear": "2013",
      "artist": "Phish",
      "venue": "Saratoga Performing Arts Center",
      "city": "Saratoga Springs",
      "state": "NY",
      "country": "USA",
      "venueid": "220",
      "meta": "",
      "nicedate": "July 05, 2013",
      "relativetime": "5 months ago",
      "link": "http://phish.net/setlists/?d=2013-07-05"
  },
  {
      "showid": "1363196325",
      "showdate": "2013-07-26",
      "showyear": "2013",
      "artist": "Phish",
      "venue": "Gorge Amphitheatre",
      "city": "George",
      "state": "WA",
      "country": "USA",
      "venueid": "248",
      "meta": "",
      "nicedate": "July 26, 2013",
      "relativetime": "5 months ago",
      "link": "http://phish.net/setlists/?d=2013-07-26"
  },
];


describe('show-finder', function(){
  beforeEach(function(){
    sinon.stub(Date.prototype, 'getFullYear', function(){return 2017;});
    sinon.stub(Date.prototype, 'getMonth', function(){return 0;});
    sinon.stub(Date.prototype, 'getDate', function(){return 26;});
  });

  afterEach(function(){
    ('function' === typeof pnet.get.restore) && pnet.get.restore();
    Date.prototype.getFullYear.restore();
    Date.prototype.getMonth.restore();
    Date.prototype.getDate.restore();
  });

  it("filters out shows that aren't in the specified date range", function(done){
    sinon.stub(pnet, 'get', function(_, __, cb){
      process.nextTick(cb.bind(null, null, '', s2013));
    });

    showFinder.find({from: '2013-7', to: '2013-07-20', pnetApikey: '123'}, function(err, shows){
      expect(shows['2013']).to.deep.equal(s2013.slice(0, 2));
      done();
    });
  });

  it('is an exclusive search if the `to` date option is the first of a year', function(done){
    sinon.stub(pnet, 'get', function(_, options, cb){
      if (options.year === 2012)
        process.nextTick(cb.bind(null, null, '', s2012));
      else
        process.nextTick(cb.bind(null, null, '', s2013));
    });

    showFinder.find({from: 2012, to: 2013, pnetApikey: '123'}, function(err, shows){
      expect(shows['2012']).to.deep.equal(s2012);
      expect(shows['2013']).to.be.undefined;
      done();
    });
  });

  it('is defaults the `to` date option to the current year/month/day if not present', function(done){
    sinon.stub(pnet, 'get', function(_, options, cb){
      if (options.year === 2012)
        process.nextTick(cb.bind(null, null, '', s2012));
      else if (options.year === 2013)
        process.nextTick(cb.bind(null, null, '', s2013));
      else
        process.nextTick(cb.bind(null, null, '', []));
    });

    showFinder.find({from: 2012, pnetApikey: '123'}, function(err, shows){
      expect(shows['2012']).to.deep.equal(s2012);
      expect(shows['2013']).to.deep.equal(s2013);
      expect(shows['2014']).to.deep.equal([]);
      done();
    });
  });
});