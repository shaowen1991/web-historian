var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var indexFile;
var css;
var loading;
// require more modules/folders here!
fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
  if (err) throw err;
  indexFile = data;
});
fs.readFile(archive.paths.siteAssets + '/styles.css', function(err, data) {
  if (err) throw err;
  css = data;
});
fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
  if (err) throw err;
  loading = data;
});

var responseOnArch = function(req, res, trueCode, failCode) {
  var headers = req.headers;
  archive.isUrlArchived(req.url.slice(1), function(exist) {
    if (exist) {
      fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
        if (err) throw err;
        headers['Content-Type'] = 'text/html';
        res.writeHead(trueCode, headers);
        res.end(data.toString());
      });
    } else {
      headers['Content-Type'] = 'text/html';
      res.writeHead(failCode, headers);
      res.end(loading.toString());
    }
  });
}

exports.handleRequest = function (req, res) {
  var headers = req.headers;
  //get index.html
  if (req.method === 'GET' && req.url === '/') {
    headers['Content-Type'] = 'text/html';
    res.writeHead(200, headers);
    res.end(indexFile.toString());
  } 
  //get css
  else if (req.method === 'GET' && req.url === '/styles.css') {
    headers['Content-Type'] = 'text/css';
    res.writeHead(200, headers);
    res.end((css).toString());
  } 
  //other get
  else if (req.method === 'GET') {
    responseOnArch(req, res, 200, 404);
  }
  //post
  else if (req.method === 'POST') {
    var page = '';
    var code = 200;
    req.on('data', function(message) {
      var url = message.toString().slice(4);
      console.log('Data');
      archive.isUrlArchived(url, function(exist) {
        //if url exist in archive
        if (exist) {
          console.log('EXIST');
          fs.readFile(archive.paths.archivedSites + '/' + url, function(err, data) {
            if (err) throw err;
            archive.addUrlToList(url, function() {
              res.statusCode = 302;
              res.end(loading.toString());
            })
          });
        } 
        //if url not exist in archive
        else {   
          console.log('NON EXIST');
          archive.addUrlToList(url, function() {
            res.statusCode = 302;
            res.end(loading.toString());
          });
        }

      });
    });
  }
};
