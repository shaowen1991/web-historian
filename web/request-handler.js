var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var indexFile;
// require more modules/folders here!
fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
  if (err) {
    throw err;
  }
  indexFile = data;
});

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  if (req.method === 'GET' && req.url === '/') {
    // console.log('INIT');
    res.end((indexFile).toString());
  } else if (req.method === 'GET') {
    // console.log('GET url: ', req.url);
    archive.isUrlArchived(req.url.slice(1), function(exist) {
      if (exist) {
        fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
          if (err) {
            throw err;
          }
          res.end(data.toString());
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  } else if (req.method === 'POST') {

    req.on('data', function(message) {
      var url = message.toString().slice(4);
      console.log("POST DATA: ", url);
      archive.addUrlToList(url, function() {
        res.statusCode = 302;
        res.end(); 
      });
    });
    
  }
};
