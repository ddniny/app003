
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
    var Db = require('mongodb').Db;
    var Server = require('mongodb').Server;
  var db = new Db('test', new Server('localhost', 27017, {auto_reconnect:true}, {}));
    db.open(function(){
        db.collection('my_test',function(err, collection){
            if(err) callback(err);
            collection.find({}).toArray(function(err,docs){
                if (err) callback(err);
                console.log(docs);
                //res.send(JSON.stringify(docs));
                //res.render('index', docs);
                res.render('index', {list : docs});
                res.end();
            });
        });
    });
};