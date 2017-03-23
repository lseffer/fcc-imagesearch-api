var express = require("express");
var url = require("url");
var searchapi = require("./bing_search.js");
var mongoose = require('mongoose');
 
mongoose.connect('mongodb://127.0.0.1/imgsearch');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongodb connected!');
});
var Schema = mongoose.Schema;
var searchSchema = new Schema({
    term : String,
    time : String
});
var searchModel = mongoose.model('searchEngine', searchSchema);



// export BAPI=$(cat bingapikey.txt)
// echo $BAPI

var app = express();

app.get('/api/imagesearch/latest', function(req, res){
    
    searchModel.find({}).sort({time: -1}).limit(10).select({_id:0, time:1,term:1}).exec( 
    function(err, searches) {
        if(err) return console.error(err);
        res.json(searches);
        console.log('Latest search results successfully sent.');
    }
); 
});

app.get('/api/imagesearch/*', function(req, res) {
    
    var offset = parseInt(url.parse(req.url,true)['query']['offset'],10) || 0;
    var querystring = url.parse(req.url,true)['pathname'].split('imagesearch/')[1];
    // console.log(querystring);
    searchapi.searchBing(querystring, offset, function(data){
        res.json(data);
        
        var newsearch = new searchModel({term:querystring,time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')});
        newsearch.save(function(err, newsearch, rows){
            if(err) return console.error(err);
            console.log('Saved query: '+newsearch.term+' at '+newsearch.time);
        });
        
    });
    
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Server listening on port ' + port.toString(10) + '. Press Ctrl+C to shutdown.');
});
