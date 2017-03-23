var mongoose = require('mongoose');
 
mongoose.connect('mongodb://127.0.0.1/imgsearch');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected!');
});

var Schema = mongoose.Schema;
 
var searchSchema = new Schema({
    term : String,
    time : Date
});

var searchModel = mongoose.model('searchEngine', searchSchema);
var newsearch = new searchModel({term:'testquery',time:Date.now()});
newsearch.save(function(err, newsearch, rows){
    if(err) return console.error(err);
    console.log('saved '+newsearch.time);
});

searchModel.find({}).sort({time: -1}).limit(10).select({_id:0, time:1,term:1}).exec( 
    function(err, searches) {
        if(err) return console.error(err);
        
        console.log(searches);
    }
);


