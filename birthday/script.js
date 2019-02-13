$( document ).ready(function() {

    // Code by Matheus Lin
// While developing a version of "Chain Reaction", I ended up on
// those "fireworks-like" things. I leave it to you here.
// Chain Reaction coming up next!

// Configs

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var minVx = -10;
var deltaVx = 20;
var minVy = 25
var deltaVy = 15;
var minParticleV = 5;
var deltaParticleV = 5;

var gravity = 1;

var explosionRadius = 200;
var bombRadius = 10;
var explodingDuration = 100;
var explosionDividerFactor = 10; // I couldn't find a better name. Got any?

var nBombs = 1; // initial
var percentChanceNewBomb = 5;

// Color utils forked from http://andreasstorm.com/
// (or someone who forked from there)

function Color(min) {
  min = min || 0;
  this.r = colorValue(min);
  this.g = colorValue(min);
  this.b = colorValue(min);
  this.style = createColorStyle(this.r, this.g, this.b);
};

function colorValue(min) {
  return Math.floor(Math.random() * 255 + min);
}

function createColorStyle(r,g,b) {
  return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
}

// A Bomb. Or firework.
function Bomb(){
  var self = this;
  
  self.radius = bombRadius;
  self.previousRadius = bombRadius;
  self.explodingDuration = explodingDuration;
  self.hasExploded = false;
  self.alive = true;
  self.color = new Color();
  
  self.px = (window.innerWidth / 4) + (Math.random() * window.innerWidth / 2);
  self.py = window.innerHeight;
  
  self.vx = minVx + Math.random() * deltaVx;
  self.vy = (minVy + Math.random() * deltaVy) * -1; // because y grows downwards

  self.duration = 

  self.update = function(particlesVector){
    if(self.hasExploded){
      var deltaRadius = explosionRadius - self.radius;
      self.previousRadius = self.radius;
      self.radius += deltaRadius / explosionDividerFactor;
      self.explodingDuration--;
      if(self.explodingDuration == 0){
        self.alive = false;
      }
    }
    else{
      self.vx += 0;
      self.vy += gravity;
      if(self.vy >= 0){ // invertion point
        self.explode(particlesVector);
      }

      self.px += self.vx;
      self.py += self.vy;
    }
  };

  self.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(self.px, self.py, self.previousRadius, 0, Math.PI * 2, false);
    if(self.hasExploded){
    }
    else{
      ctx.fillStyle = self.color.style;
      ctx.lineWidth = 1;
      ctx.fill();
    }
    
  };
  

  self.explode = function(particlesVector){
    self.hasExploded = true;
    var e = 3 + Math.floor(Math.random() * 3);
    for(var j = 0; j < e; j++){
      var n = 10 + Math.floor(Math.random() * 21); // 10 - 30
      var speed = minParticleV + Math.random() * deltaParticleV;
      var deltaAngle = 2 * Math.PI / n;
      var initialAngle = Math.random() * deltaAngle;
      for(var i = 0; i < n; i++){
        particlesVector.push(new Particle(self,  i * deltaAngle + initialAngle, speed));
      }
    }
  };
  
}

function Particle(parent, angle, speed){
  var self = this;
  self.px = parent.px;
  self.py = parent.py;
  self.vx = Math.cos(angle) * speed;
  self.vy = Math.sin(angle) * speed;
  self.color = parent.color;
  self.duration = 40 + Math.floor(Math.random()*20);
  self.alive = true;

  self.update = function(){
    self.vx += 0;
    self.vy += gravity / 10;

    self.px += self.vx;
    self.py += self.vy;
    self.radius = 3;

    self.duration--;
    if(self.duration <= 0){
      self.alive = false;
    }
  };

  self.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(self.px, self.py, self.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = self.color.style;
    ctx.lineWidth = 1;
    ctx.fill();
  };

}

function Controller(){
  var self = this;
  self.canvas = document.getElementById("screen");
  self.canvas.width = screenWidth;
  self.canvas.height = screenHeight;
  self.ctx = self.canvas.getContext('2d');

  function setSpeedParams(){
    var heightReached = 0;
    var vy = 0;

    while(heightReached < screenHeight && vy >= 0){
      vy += gravity;
      heightReached += vy;
    }

    minVy = vy / 2;
    deltaVy = vy - minVy;

    vx = (1 / 4) * screenWidth / (vy / 2);
    minVx = -vx;
    deltaVx = 2*vx;
  };

  

  self.resize = function(){
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    self.canvas.width = screenWidth;
    self.canvas.height = screenHeight;
    setSpeedParams();
  };
  self.resize();

  window.onresize = self.resize;

  self.init = function(){
    self.readyBombs = [];
    self.explodedBombs = [];
    self.particles = [];

    for(var i = 0; i < nBombs; i++){
      self.readyBombs.push(new Bomb());
    }
  }

  self.update = function(){
    var aliveBombs = [];
    while(self.explodedBombs.length > 0){
      var bomb = self.explodedBombs.shift();
      bomb.update();
      if(bomb.alive){
        aliveBombs.push(bomb);
      }
    }
    self.explodedBombs = aliveBombs;

    var notExplodedBombs = [];
    while(self.readyBombs.length > 0){
      var bomb = self.readyBombs.shift();
      bomb.update(self.particles);
      if(bomb.hasExploded){
        self.explodedBombs.push(bomb);
      }
      else{
        notExplodedBombs.push(bomb);
      }
    }
    self.readyBombs = notExplodedBombs;

    var aliveParticles = [];
    while(self.particles.length > 0){
      var particle = self.particles.shift();
      particle.update();
      if(particle.alive){
        aliveParticles.push(particle);
      }
    }
    self.particles = aliveParticles;
  }

  self.draw = function(){
    self.ctx.beginPath();
    self.ctx.fillStyle='rgba(0, 0, 0, 0.1)'; // Ghostly effect
    self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
    
    
    
    for(var i = 0; i < self.readyBombs.length; i++){
      self.readyBombs[i].draw(self.ctx);
    }

    for(var i = 0; i < self.explodedBombs.length; i++){
      self.explodedBombs[i].draw(self.ctx);
    }

    for(var i = 0; i < self.particles.length; i++){
      self.particles[i].draw(self.ctx);
    }

  }

  self.animation = function(){
    self.update();
    self.draw();
    
   if(Math.random() * 100 < percentChanceNewBomb) {
     self.readyBombs.push(new Bomb());
   }
    
        
    requestAnimationFrame(self.animation);
  }
}



// countdown
let timer = setInterval(function() {

    year = (new Date().getFullYear());
    today = new Date().getTime();
    timeGift1 = new Date(year, 11, 19).getTime();
    timeGift2 = new Date(year, 11, 20).getTime();
    timeGift3 = new Date(year, 11, 21).getTime();
    timeGift4 = new Date(year, 11, 22).getTime();

    
    diff = timeGift1 - today;
    if(timeGift1 < today){
        diff = timeGift2 - today;
        if(timeGift2 < today){
            diff = timeGift3 - today;
            if(timeGift3 < today){
                diff = timeGift4 - today;
                if(timeGift4 < today){
                    timeGift1 = new Date(year+1, 10, 19).getTime();
                    diff = timeGift1 - today;
                }
            }
        }
    }

  // math
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // display
  document.getElementById("timer").innerHTML ="<div class='days'><div class='numbers'>" + days + "</div>days</div><div class='hours'><div class='numbers'>" + hours + "</div>hours</div><div class='minutes'><div class='numbers'>" + minutes + "</div>minutes</div><div class='seconds'><div class='numbers'>" + seconds + "</div>seconds</div></div>";

}, 1000);

click1 = click2 = click3 = click4 = false;
    $('#next').on('click',function(){
        $('body').html('');
        $('body').css("padding","0")
        $('body').css("background", "#183059");
        $('body').append('<canvas id="screen"></canvas><div id="time"><div class="container">  <div class="balloon white"><div class="star-red"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div class="balloon red"><div class="star"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div class="balloon blue"><div class="star"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div id="timer"></div><h2 id="title-time">Before Your Next Gift !</h2></div></div>')
        $('body').append('<div class="gifts"></div>')
        $('.gifts').append('<div id="number-1" class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div id="number-2" class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div id="number-3" class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div id="number-4" class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gift').on('click',function(){
            switch ($(this).get(0).id) {
                case 'number-1':
                    if(timeGift1 < today && click1 == false){
                        $('audio').remove();
                        $(this).children("#circle").hide()
                        $(this).append('<img src="assets/rfgudhfd.png"><audio autoplay src="assets/gnutrdpfg.mp3"></audio>');
                        click1 = true;
                        $('body').css("background", "black");
                        $('canvas').css('display',"block")
                        var controller = new Controller();
                        controller.init();
                        requestAnimationFrame(controller.animation);
                    }
                    break;
                case 'number-2':
                    if(timeGift2 < today && click2 == false){
                        $('audio').remove();
                        $(this).children("#circle").hide()
                        $(this).append('<img src="assets/jfdhbvhjebfd.png"><audio autoplay src="assets/hfgvjhdbvhf.mp3"></audio>');
                        click2 = true;
                        $('body').css("background", "black");
                        $('canvas').css('display',"block")
                        var controller = new Controller();
                        controller.init();
                        requestAnimationFrame(controller.animation);
                    }
                    break;
                case 'number-3':
                    if(timeGift3 < today && click3 == false){
                        $('audio').remove();
                        $(this).children("#circle").hide()
                        $(this).append('<img src="assets/rgrtgrtg.png"><audio autoplay src="assets/rfdferfer.mp3"></audio>');
                        click3 = true;
                        $('body').css("background", "black");
                        $('canvas').css('display',"block")
                        var controller = new Controller();
                        controller.init();
                        requestAnimationFrame(controller.animation);
                    }
                    break;
                case 'number-4':
                    if(timeGift4 < today && click4 == false){
                        $('audio').remove();
                        $(this).children("#circle").hide()
                        $(this).append('<img src="assets/bfdjhbfdbfd.png"><audio autoplay src="assets/bfdjbfvd.mp3"></audio>');
                        click4 = true;
                        $('body').css("background", "black");
                        $('canvas').css('display',"block")
                        var controller = new Controller();
                        controller.init();
                        requestAnimationFrame(controller.animation);
                    }
                    break;
            
                default:
                    break;
            }
        })
    });


})

