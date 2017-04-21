// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var urls;

fs.readFile(archive.paths.list, function(err, data) {
  if (err) throw err;
  urls = data.toString().split('\n');
  archive.downloadUrls(urls);
});


