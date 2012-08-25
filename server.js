var flatiron = require('flatiron'),
  ecstatic = require('ecstatic'),
  config = require('./config'),
  app = flatiron.app;

var Factual = require('factual-api');
console.log(config);
var factual = new Factual(config.key, config.secret);

app.use(flatiron.plugins.http);

app.http.before = [
  ecstatic(__dirname + '/public'),
  function(req,res) {
    console.log(req.method + ' ' + req.url);
    res.emit('next');
  }

];

app.router.post('/api/deals', function(){
  var self = this, loc = this.req.body;
  //, filters: {source_namespace: { $eq: "groupon"}}
  factual.get('/places/monetize', {geo:{$circle:{$center:[loc.lat,loc.lng], $meters: 20000}}, filters: { source_namespace: { $neq: "grubhub"}}}, function (error, res) {
    self.res.json(res.data);
    console.log(res.data);
  });  
});


app.router.post('/api/locate', function(){
  var self = this, loc = this.req.body;
  console.log(loc);
  //, filters: {source_namespace: { $eq: "groupon"}}
  factual.get('/places/geocode', {geo: {$point: [loc.lat, loc.lng]}}, function(err, res){
    console.log(res.data);
    var values = {locality: res.data[0].locality, region: res.data[0].region, name: loc.name, latitude: loc.lat, longitude: loc.lng};
    console.log(values);
    factual.get('/places/resolve', {debug: true, values: values}, function (error, res) {
      self.res.json(res.data);
      //console.log(res.data);
    });      
  });
});


app.start(3000);
