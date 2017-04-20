var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      throw err;
    }
    var list = data.toString().split('\n');
    console.log('READ LIST OF URLS: ', list);
    callback(list);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    var isInList = _.contains(urls, url);
    callback(isInList);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(exist) {
    if (!exist) {
      exports.readListOfUrls(function(list) {
        list.push(url);
        fs.writeFile(exports.paths.list, list.join('\n'));
        callback();
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    //files = ['fileA', 'fileB']
    if (err) {
      throw err;
    }
    var isInArch = _.contains(files, url);
    callback(isInArch);
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
    var request = http.get('http://' + url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
      });
    }).on('error', function(err) {
      fs.unlink(url);
      throw err;
    });
  });
};
