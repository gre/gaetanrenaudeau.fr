$(document).ready(function(){
  // nav managment
  (function(){
    var updatePage = function() {
      var nav = !location.hash ? 'home' : location.hash.substring(1);
      var node = $('#page_'+nav);
      if(node.size()==0)
        location.hash = nav = 'home';
      else {
        var navLink = $('nav a[href=#'+nav+']');
        document.title = 'Gaetan Renaudeau - '+navLink.text();
        node.addClass('current').siblings().removeClass('current');
        navLink.parent().addClass('selected').siblings().removeClass('selected');
      }
    }
    updatePage();
    $(window).hashchange(function(){
      updatePage();
    });
  }());

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  // header animation
  (function(){
    if(!document.createElement('canvas').getContext) return;
    var canvas = null;
    var ctx = null;
    var lineCount = 5;
    var date = new Date().getTime();
    var cycle = function() {
      var i = (new Date().getTime() - date)/20;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(var j=0; j<lineCount; ++j) {
        ctx.lineWidth = 2+4*(lineCount-j);
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        var offset = (i+j*10*(0.1+Math.abs(Math.cos(i/100))))/20;
        var y = (Math.sin(offset)+1)*canvas.height/2;
        var cpy1 = (Math.cos(offset)+0.5)*canvas.height;
        var cpy2 = canvas.height - cpy1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(canvas.width/3, cpy1, 2*canvas.width/3, cpy2, canvas.width, y);
        ctx.stroke();
      }
      requestAnimFrame(cycle, canvas);
    };
    canvas = document.getElementById('headerAnimation');
    ctx = canvas.getContext('2d');
    i=1000+Math.floor(Math.random()*1000);
    cycle();
  }());
  
  // Projects
  (function() {
    var slideDuration = 2000;
    var slideAnimationDuration = 200;
    var slide = function(node) {
      var images = $('img', node).hide();
      $(images.get(0)).show();
      var count = images.size();
      var i = 0;
      setInterval(function() {
        var next = (i+1)%count;
        $(images.get(i)).fadeOut(slideAnimationDuration);
        $(images.get(next)).fadeIn(slideAnimationDuration);
        i = next;
      }, slideDuration);
    };
    var imagesNodes = $('.images');
    var bestInterval = imagesNodes.size() ? Math.floor(slideDuration / imagesNodes.size()) : 0; // optimize cpu occupation
    imagesNodes.each(function(i) {
      var images = this;
      if($('img', images).size()>1) {
        setTimeout(function() {
          slide(images);
        }, bestInterval);
      }
    });
  }());
  
  // blog
  (function(){
    var feed = 'http://blog.greweb.fr/feed?feed=json&jsonp=?';
    var blogArticles = $('#blog_articles .articles');
    var appendArticle = function(a) {
      var node = $('<li class="article">'+
      '<span class="date">'+a.date+'</span> <a href="'+a.permalink+'" class="title">'+a.title+'</a>'+
      '<div class="excerpt"></div>'+
      '</li>');
      $('.excerpt', node).html(a.excerpt);
      blogArticles.append(node);
    };
    $('#blog_articles').show();
    $('#blog_articles .articles').hide();
    $.getJSON(feed, function(data){
      $.each(data, function(i, d){
        blogArticles.append(appendArticle(d));
      });
      $('.blog.loadMessage').hide();
      $('#blog_articles .articles').show();
    });
  }());
  
  // Update height
  $(window).resize(function(){
    $('#main').css('min-height', ($(window).height()-($('#wrapper').height()-$('#main').height())));
  }).resize();
  
});
