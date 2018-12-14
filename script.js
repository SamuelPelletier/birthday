$( document ).ready(function() {
    $('#next').on('click',function(){
        $('body').html('');
        $('body').css("padding","0")
        $('body').css("background", "#183059");
        $('body').append('<div id="time"><div class="container">  <div class="balloon white"><div class="star-red"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div class="balloon red"><div class="star"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div class="balloon blue"><div class="star"></div><div class="face"><div class="eye"></div><div class="mouth happy"></div></div><div class="triangle"></div><div class="string"></div></div><div id="timer"></div><h2 id="title-time">For Your Next Gift !</h2></div></div>')
        $('body').append('<div class="gifts"></div>')
        $('.gifts').append('<div class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
        $('.gifts').append('<div class="gift"><div id="circle"> <div id="gift"><div id="ribbon"></div><div id="giftbox"></div></div></div></div>');
       
    });


})

// countdown
let timer = setInterval(function() {

    const year = (new Date().getFullYear());
    timeGift = new Date(year, 11, 19).getTime();
    const today = new Date().getTime();
    if(timeGift < today){
        timeGift = new Date(year, 11, 20).getTime();
        if(timeGift < today){
            timeGift = new Date(year, 11, 21).getTime();
            if(timeGift < today){
                timeGift = new Date(year, 11, 22).getTime();
            }
        }
        
    }
    
  // get the difference
  const diff = timeGift - today;

  // math
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // display
  document.getElementById("timer").innerHTML =
    "<div class=\"days\"> \
    <div class=\"numbers\">" + days + "</div>days</div> \
    <div class=\"hours\"> \
  <div class=\"numbers\">" + hours + "</div>hours</div> \
<div class=\"minutes\"> \
  <div class=\"numbers\">" + minutes + "</div>minutes</div> \
<div class=\"seconds\"> \
  <div class=\"numbers\">" + seconds + "</div>seconds</div> \
</div>";

}, 1000);

