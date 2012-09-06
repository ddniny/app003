
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

app.post('/add',function(req, res){
    var data={};
    data.userName = req.body.userName;
    data.miaohao = req.body.miaohao;
    data.shihao = req.body.shihao;
    data.nianhao = req.body.nianhao;

    var tmp_path = req.files.avatar.path;
    var imgType;
    console.log(req.files.avatar.type);
    if(req.files.avatar.type == "image/jpeg"){
        imgType = "jpg";
    } else {
        imgType = "gif";
    }
    console.log(imgType);
    var date = new Date();
    var format_name = Date.UTC(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()) + "." + imgType;
    var target_path = './public/images/' + format_name;

    data.tuxiang = format_name;
    fs.rename(tmp_path, target_path, function (err) {
        if (err) throw err;
        fs.unlink(tmp_path, function () {
            if (err) throw err;
        });
    });

    var Db = require('mongodb').Db;
    var Server = require('mongodb').Server;
    var db = new Db('test', new Server('localhost', 27017, {auto_reconnect:true}, {}));
    db.open(function(){
        db.collection('my_test',function(err, collection){
            if(err) callback(err);
            collection.insert(data, {safe:true}, function(err, docs){
                if(err) console.log("出错了！");
                //console.log(docs[0]._id + docs[0].userName);
                res.redirect('/');
                res.end();
            });
        });
    });
})
