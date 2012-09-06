/*
 * GET home page.
 */
var $ = require("jquery");
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var img_path = __dirname + "/";
var fs = require("fs");
var util = require("util");
exports.index = function (req, res) {
    res.render('index', { title:'Express' });
};

function add(req, res) {
    var user = {};
    var url=__dirname.substr(0, __dirname.lastIndexOf("\\")) + "/public/images/" + req.files.photo.name;
    user.name = req.body.name;
    user.miaohao = req.body.miaohao;
    user.yuhao = req.body.yuhao;
    user.nianhao = req.body.nianhao;
    user.imgurl = "/images/" + req.files.photo.name;
    console.log(user.imgurl);
    fs.readFile(req.files.photo.path, function (err, data) {
        if (err)
            throw err;
        else {
            fs.writeFile(url, data, function (err) {
                if (err)
                    throw err;
                else {
                    var db = new Db('test', new Server('localhost', 27017, {auto_reconnect:true}, {}));
                    db.open(function () {
                            console.log('db opened');
                            db.collection('test', function (err, collection) {
                                if (err) {
                                    throw (err);
                                    res.send("collection to db failed!");
                                } else {
                                    collection.insert(user, {safe:true}, function (err, docs) {
                                        if (err) {
                                            throw (err);
                                            res.send("insert into db failed!");
                                        } else {
                                            console.log(docs[0]._id);
                                            db.close();
                                            res.redirect("/view");
                                            res.end();
                                        }
                                    });
                                }
                            });
                        }
                    )
                }
            });
        }
    });
}
function views(req, res) {
    var users = [];
    var db = new Db('test', new Server('localhost', 27017, {auto_reconnect:true}, {}));
    db.open(function () {
        db.collection('test', function (err, collection) {
            if (err) throw err;
            collection.find({}).toArray(function (err, docs) {
                if (err) throw err;
                console.log(docs);
                res.render("index", {"users":docs});
            });
        });
    });
}

exports.add = add;
exports.views = views;