# flite2
**npm binding for flite, a tiny text-to-speech synthesizer.**

node-flite2 is a fork from the original node-flite made to make it compatible with the current 2.0 version of flite. It also releases a control on the voices, that prevented it from using user-imported voices.

flite2 was developed to be used in combination with the iannitts package. 

(copyleft)ianni67 2018. Please share and enjoy.


## installation

    $ npm install flite2

also requires `flite 2.0.x` or `flite 1.4.x` ([www](http://www.speech.cs.cmu.edu/flite/)) and either `aplay`([www](http://alsa.opensrc.org/Aplay)) or `afplay` (default on OS X) to be installed and in your `$PATH`. Working on OSX and linux. Windows is currently untested and likely unsupported.

Flite is super tiny and fast and works great on ARM (eg, robots!), and has a variety of voices available (which are compiled into the binary - you probably want to build it yourself).

## example

    var flite = require('flite2')

    var message = "you know what we need? some more waffles!"

    flite(function (err, speech) {
      if (err) { return console.error(err) }
      speech.say(message, function (err) {
        if (err) { return console.error(err) }
        /// make sure to have your sound on :)
      });
    });

## usage

    var flite = require('flite2')
    flite([config], callback)

 - config object (optional)
 - callback: function (err, speech) - initializes and returns a speech object

config is an object with any of the following keys

 - voice: string - the name of a voice
 - ssml: boolean - treat input as [ssml](http://en.wikipedia.org/wiki/Speech_Synthesis_Markup_Language)


`speech.voices // array`

  array of valid voice names to use with the `voice` configuration setting.


`speech.config(configObj)`

  set configuration settings for this instance of `speech`

`speech.say(text, [fileout], callback)`

  speak the given input string `text`. if `fileout` is specified, the wavefile will be writen to that file and not to the speakers. if `fileout` is omitted, the wavefile will be played immediately. `callback` is invoked after the wavefile is written or the sound is done playing.

## license
Original license: MIT. (c) 2012 jden - Jason Denizac <jason@denizac.org>

My license: oh well... the same as before. 

For this version: (c)ianni67 2018 
