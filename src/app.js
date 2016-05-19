/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */


//var ="87520259";

var mode = 0;
var max_mode = 1;
var options;
var conf = false;
var EnvoiEncours = false;

var t = {
  inc: 
    {
      code: ["vol_inc", "prgm_inc"],
      x: 86, 
      x_enf: 96
    },
  dec:
    {
      code: ["vol_dec", "prgm_dec"],
      touche: "dec",
      x: 86, 
      x_enf: 96
    },
  play:
    {
      code: "play",
      x: 50, 
      x_enf: 55
    },
  power:
    {
      code: "power",
      x: 50, 
      x_enf: 55
    },
  mute:
    {
      code: "mute",
      x: 50, 
      x_enf: 55
    }
};


var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Settings = require('settings');

Settings.config(
  { url: 'http://jp.bin.free.fr/freepebble/config.html?' },
  function(e) {
    console.log('opening configurable');
  },
  function(e) {
    TestConfig();
  }
);

function click(touche) {
  // animation  
  if (! EnvoiEncours) {
    EnvoiEncours = true;
    var pos1 = touche.img.position();
    pos1.x = touche.x_enf;
    touche.img.animate('position', pos1, 200);
    
    var code;
   
    if( typeof touche.code === 'string' ) {
      code =  touche.code;
       //console.log(code);
    } else {
      code = touche.code[mode];
    }
    
    var vurl = "http://" + options.nu + ".freebox.fr/pub/remote_control?code=" + options.code + "&key=" + code;
    
    ajax({ url: vurl,  type: 'text',  cache: false},
      function(data) {
        var pos2 = touche.img.position();
        pos2.x = touche.x;
        touche.img.animate('position', pos2, 200);
        EnvoiEncours = false;
       },
      function (data) {
        var pos2 = touche.img.position();
        pos2.x = touche.x;
        touche.img.animate('position', pos2, 200);
        EnvoiEncours = false;
        
        var msg = "Erreur inconnue";
        if (data === "") 
          msg = "Player semble introuvable";
        if (data.indexOf("Forbidden") > -1)
          msg = "Le code semble incorrect";
        //console.log(data);
        var werr = new UI.Card({
            title: "Erreur ! ",
            body: msg 
          });
        werr.show();
      });
  }
}


var main = new UI.Window({
  backgroundColor: "74685c",
  fullscreen: true
});

var imginc = new UI.Image({
  position: new Vector2(86, 0),
  size: new Vector2(58, 58),
  image: 'images/inc.png'
});
main.add(imginc);
t.inc.img = imginc;

var imgdec = new UI.Image({
    position: new Vector2(86, 110),
    size: new Vector2(58, 58),
    image: 'images/dec.png'
  });
main.add(imgdec);
t.dec.img = imgdec;

var tAction = new UI.Text({
    position: new Vector2(86, 68),
    size: new Vector2(58, 28),
    font: 'gothic-28-bold',
    color: 'white',
    text: 'VOL',
    textAlign: 'center'
  });
main.add(tAction);

var mrect = new UI.Rect({
    position: new Vector2(46, 4),
    size: new Vector2(32, 152),
    backgroundColor: 'clear',
    borderColor: 'white'
  });
main.add(mrect);

var t1 = new UI.Text({
    position: new Vector2(46, 4),
    size: new Vector2(32, 28),
    font: 'gothic-14',
    color: 'white',
    text: 'long',
    textAlign: 'center'
  });
main.add(t1);

var imgplay = new UI.Image({
    position: new Vector2(50, 34),
    size: new Vector2(24, 24),
    image: 'images/play.png'
  });
main.add(imgplay);
t.play.img = imgplay;

var imgmarche = new UI.Image({
    position: new Vector2(50, 72),
    size: new Vector2(24, 24),
    image: 'images/marche.png'
  });
main.add(imgmarche);
t.power.img = imgmarche;

var imgmute = new UI.Image({
    position: new Vector2(50, 110),
    size: new Vector2(24, 24),
    image: 'images/mute.png'
  });
main.add(imgmute);
t.mute.img = imgmute;

var imgfree = new UI.Image({
    position: new Vector2(2, 83),
    size: new Vector2(32, 83),
    image: 'images/free.png'
  });
main.add(imgfree);

TestConfig();


function change() {
  mode++;
  if (mode > max_mode) {
    mode = 0;
  }
  //main.body = mode;
  
  switch(mode) {
    case 0:
      //main.action('select', 'images/vol.png');
      tAction.text('VOL');
      break;
    case 1:
      //main.action('select', 'images/prog.png');
      tAction.text('PROG');
      break;
  }
}

main.on('click', 'up', function(e) {
  click(t.inc);
  
});

main.on('click', 'select', function(e) {
  change();
});

main.on('click', 'down', function(e) {
  click(t.dec);
});

main.on('longClick', 'up', function(e) {
  click(t.play);
});

main.on('longClick', 'down', function(e) {
  //console.log("long mute");
  click(t.mute);
});

main.on('longClick', 'select', function(e) {
  click(t.power);
});



function  TestConfig() {
  options = Settings.option();
  if (!options.code) {
    main.hide();
    conf = new UI.Card({
      title: "Freebox Télec",
      body: "Merci de compléter la config"
    });
    conf.show();
  } else {
    main.show();
    if (conf) {
      conf.hide();
    }
  }
}

