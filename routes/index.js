
/*
 * GET home page.
 */

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;
var db = new Db('test', new Server('localhost', 27017, {auto_reconnect: true}, {}));
var assert = require('assert');
var fs = require('fs');

exports.index = function(req, res) {
    res.render('index', { title: '帝王年鉴' });
};

// Save information of emperor
exports.saveEmperor = function(req, res) {
    // Save data
    
    var emperor = {};
    emperor.name = req.body.name;
    emperor.temple = req.body.temple;
    emperor.posthumous = req.body.posthumous;
    emperor.reign = String(req.body.reign).split(',');
    
    db.open(function(err, db) {
        assert.equal(null, err);
        db.collection('emperors', function(err, collection) {
            assert.equal(null, err);
            collection.insert(emperor, { saft: true }, function(err, docs) {
                assert.equal(null, err);
                console.log(docs[0]._id);
                db.close();
                res.send('success');
                res.end();
            });
        });
    });
};

// Load list of emperors
exports.loadEmperor = function(req, res) {
    // Find data
    
    db.open(function(err, db) {
        assert.equal(null, err);
        db.collection('emperors', function(err, collection) {
            assert.equal(null, err);
            collection.find({}).toArray(function(err, docs) {
                assert.equal(null, err);
                res.send(docs);
                res.end();
                db.close();
            });
        });
    });
};

// Upload image of emperor
exports.uploadImage = function(req, res) {
    var id = req.body.eid;
    
    var fpath = req.files.avatars.path;
    var fname = req.files.avatars.name;
    
    var gs = new GridStore(db, new ObjectID(id), fname, 'w', {
        'content-type': 'image/jpg',
        'metadata': {
            'author': 'jiaxun'
        },
        'chunk_size': 4096
    });
    gs.writeFile(fpath, function(err, gss) {
        assert.equal(null, err);
        db.open(function(err, db) {
            assert.equal(null, err);
            db.collection('emperors', function(err, collection) {
                assert.equal(null, err);
                collection.update({_id:new ObjectID(id)}, {$set:{avatars:gss._id}}, {safe:true}, function(err, data) {
                    assert.equal(null, err);
                    gs.close(function(err, gs) {
                        assert.equal(null, err);
                        db.close();
                        res.redirect('/');
                        res.end();
                    });
                });
            });
        });
    });
};

// Load image of emperor
exports.loadImage = function(req, res) {
    // Find image by id
    var id = req.params.id;
    var gs = new GridStore(db, new ObjectID(id), 'r');
    gs.open(function(err, gss) {
        assert.equal(null, err);
        gss.read(function(err, data) {
            assert.equal(null, err);
            res.writeHead(200, {'content-type':'image/jpg'});
            res.write(data, 'binary');
            res.end();
        });
    });
};