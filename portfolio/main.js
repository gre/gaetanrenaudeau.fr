function CanvasSlider(canvas, imagesUrl) {
  var self = this;
  var currentTime = function(){ return new Date().getTime() }
  self.canvas = canvas;
  self.ctx = canvas.getContext('2d');
  self.loaded = 0;
  self.total = imagesUrl.length;
  self.transitionDuration = 2000;
  self.stayDuration = 3000;
  // variables
  self.currentImage = 0;
  self.transitionStart = null;
  self.nextImage = function(){
    return self.currentImage >= self.total-1 ? 0 : self.currentImage+1;
  }
  self.drawImage = function(img) {
    self.ctx.drawImage(img, 0, 0);
  }
  self.drawPartialImage = function(img, ratio) {
    var ctx = self.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(self.canvas.width/2, self.canvas.height/2);
    ctx.arc(self.canvas.width/2, self.canvas.height/2, 
        Math.max(self.canvas.width, self.canvas.height),
        0, Math.PI*2*(ratio), false);
    ctx.clip();
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }
  self.render = function(){
    if( !$(self.canvas).is(':visible') ) return;
    var now = currentTime();
    if(now >= self.transitionStart) {
      var ratio = Math.min(1, (now - self.transitionStart) / self.transitionDuration);
      var next = self.nextImage();
      if(ratio==1) {
        self.transitionStart = now + self.stayDuration;
        self.transitionEnd = self.transitionStart + self.transitionDuration;
        self.currentImage = next;
        self.drawImage(self.images[self.currentImage]);
      }
      else {
        self.drawImage(self.images[self.currentImage]);
        self.drawPartialImage(self.images[next], ratio);
      }
    }
  }
  self.init = function(){
    self.canvas.width  = self.images[0].width;
    self.canvas.height = self.images[0].height;
    self.transitionStart = currentTime();
    self.drawImage(self.images[0]);
    (function loop(){
      self.render();
      requestAnimationFrame(loop, self.canvas);
    }());
  }
  self.images = $.map(imagesUrl, function(url){
    var img = new Image();
    img.onload = function(){ if(++self.loaded == self.total) self.init() }
    img.src = url;
    return img;
  });
}

