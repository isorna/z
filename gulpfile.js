'use strict';

var fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  map = require('map-stream'),
  simpleGit = require('simple-git');

gulp.task('default', function () {
  // place code for your default task here
});

gulp.task('mitosis', function () {
  // initiate each bower_component with its corresponding git repository
  // use only after a bower install or bower update
  gulp.src('bower_components/**/.bower.json')
    .pipe(map(createRepositories));
});

/* --------------- */

var createRepositories = function(file, callback) {
  fs.exists(file.path, function(exists) {
    if (!exists) {
      var err = new Error('Component must have "' + file.path + '"');
      err.code = 'NO_._JSON';
      return callback(err);
    };

    fs.readFile(file.path, function(err, contents) {
      if (err) return callback(err);

      var json;

      try {
        json = JSON.parse(contents.toString());
      } catch(err) {
        err.code = 'EMALFORMED';
        return callback(new Error('Component JSON file is invalid in "' + file.path + '": ' + err));
      }

      simpleGit(path.dirname(file.path)).init()
        .addRemote('origin', json._source.replace('git:', 'https:'));
        /*
        .pull(function(err, update) {
          if (err) {
            console.error(err);
          }

          if(update && update.summary.changes) {
             console.log(update.summary.changes);
          }
         });*/
      console.log('Repository created: ', json._source);

      callback(null, json);
    });
  });
};
