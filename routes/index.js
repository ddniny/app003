
/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index', { title: 'Express' });
};

exports.saveEmperor = function(req, res) {
    res.send('save empire');
    res.end();
};

exports.loadEmperor = function(req, res) {
    var list = [
        {},
        {}
    ];
    res.send('');
}