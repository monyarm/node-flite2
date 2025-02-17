// node-flite2 is a fork from the original node-flite
// made to make it compatible with the current 2.x version of 
// flite. It also releases a control on the voices, that
// prevented it from using user-imported voices.
// (copyleft)ianni67 2018. Please share and enjoy.


var child = require('child_process');
var temp = require('temp');
var fs = require('fs');

var dep = {
  flite: false,
  aplay: false,
  afplay: false,
  voices: [],
  init: false
};

function init(config, cb) {
  if (!cb) {
    cb = config;
    config = {};
  }
  if (dep.init) {
    cb(null, flite(config));
  } else {
    detectFeatures(function (err) {
      if (err) return cb(err);
      cb(null, flite(config));
    });
  }
}

function detectFeatures(cb) {
  var usage = /usage/i;
  child.exec('flite --version', function (err, stdout) {
    dep.flite = /flite-2\./.test(stdout);
    dep.flite = dep.flite || (/flite-1\.4/.test(stdout));
    // both versions 2.x.x and 1.4.x are valid  
    if (!dep.flite) {
      dep.init = true;
      return cb(new Error('required binary flite not available'));
    }
    child.exec('flite -lv', function (err, stdout) {
      dep.voices = stdout.trim().split(' ').slice(2);
      child.exec('aplay --help', function (err, stdout, stderr) {
        dep.aplay = usage.test(stderr) || usage.test(stdout);
        child.exec('afplay --help', function (err, stdout, stderr) {
          dep.afplay = usage.test(stderr) || usage.test(stdout);

          dep.init = true;
          cb();
        });
      });
    });
  });
}

function flite(config) {
  if (!(this instanceof flite)) {
    return new flite(config);
  }
  this.config = config || {};
  this.voices = dep.voices.slice();
}
flite.prototype.say = say;
flite.prototype.config = config;

function save(text, path, cb) {
  if (!dep.flite) return cb(new Error('required binary flite not available'));
  child.exec(cmd.call(this, '-t "' + text + '" -o ' + path), cb);
}

function say(text, fileout, cb) {
  var self = this;
  if (!cb) {
    cb = fileout || noop;
    fileout = null;
  }
  text = escapeshell(text);
  if (fileout)
    return save.call(this, text, fileout, cb);

  if (!dep.flite || !(dep.aplay || dep.afplay))
    return cb(new Error('required binaries flite and/or aplay not available'));

  tmp(function (err, file) {
    if (err) return cb(err);
    save.call(self, text, file, function (err) {
      if (err) return cb(err);
      play(file, cb);
    });
  });
}

function play(file, cb) {
  var cmd = dep.aplay ? 'aplay' : 'afplay';
  child.exec(cmd + ' ' + file, function (err) {
    if (err) return cb(err);
    cb();
  });
}

function tmp(cb) {
  temp.open('flite-tmp', function (err, file) {
    if (err) return cb(err);
    fs.close(file.fd, function (err) {
      if (err) return cb(err);
      cb(null, file.path);
    });
  });
}

function config(cfg) {
  this.config = cfg;
}

function cmd(also) {
  var cmdStr = 'flite ';
  if (this.config.voice ) {
    cmdStr += '-voice ' + this.config.voice + ' ';
  }
  if (this.config.ssml) {
    cmdStr += '-ssml ';
  }
  cmdStr += also;
  return cmdStr;
}

function escapeshell(cmd) {
  return '"'+cmd.replace(/(["\s'$`\(\)\[\]\\\.\,\;\:])/g,'\\$1')+'"';
}

function noop() {}

module.exports = init;
