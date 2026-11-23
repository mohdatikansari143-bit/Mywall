export {};

var urlParams = new URLSearchParams(window.location.search);
var gameUrl = urlParams.get('url') || 'https://nite.games/embed/minecraft';
var gameTitle = urlParams.get('title') || 'Minecraft';
var fromSource = urlParams.get('from') || 'home';
var catParam = urlParams.get('cat') || 'All';

document.title = gameTitle + ' - Player';
document.getElementById('gameTitle').textContent = '🎮 ' + gameTitle;
document.getElementById('playBtn').setAttribute('data-src', gameUrl);

// TARGET RETURN URL FUNCTION
function getReturnTarget() {
  if (fromSource === 'category') {
    return 'games-category.html?cat=' + encodeURIComponent(catParam);
  }
  return 'Games.html';
}

// SAFE RETURN WITHOUT REPEATS
function returnToCaller() {
  window.location.replace(getReturnTarget());
}

// PHONE HARDWARE / SWIPE BACK INTERCEPT (PREVENTS REPEATING LOOPS)
history.pushState({ page: 'player' }, '');
window.addEventListener('popstate', function() {
  returnToCaller();
});

(function(){
  var GAME = gameUrl;
  var stage = document.getElementById('stage'),
      bar = document.getElementById('bar'),
      toast = document.getElementById('toast'),
      frame = null,
      tt,
      landBtn = document.getElementById('land');

  function say(m){
    toast.textContent = m;
    toast.style.display = 'block';
    clearTimeout(tt);
    tt = setTimeout(function(){toast.style.display = 'none'}, 3500);
  }

  function isFull(){ return document.fullscreenElement || (document as any).webkitFullscreenElement; }

  function goFull(){
    var r = stage.requestFullscreen || (stage as any).webkitRequestFullscreen;
    if(r){
      try{
        var p = r.call(stage);
        if(p && p.catch) p.catch(function(){});
        return p;
      } catch(e){}
    }
    return null;
  }

  function exitFull(){
    var x = document.exitFullscreen || (document as any).webkitExitFullscreen;
    if(x && isFull()){
      try{ x.call(document); } catch(e){}
    }
  }

  function start(){
    stage.classList.add('on');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.src = GAME;
      frame.allow = "fullscreen; autoplay; gamepad; pointer-lock";
      stage.insertBefore(frame, bar);
    }
    goFull();
  }

  function stop(){
    exitFull();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    stage.classList.remove('on','rot');
    if(frame){
      frame.src = 'about:blank';
      frame.remove();
      frame = null;
    }
    landBtn.classList.remove('active');
  }

  function landscape(){
    if(stage.classList.contains('rot')){
      stage.classList.remove('rot');
      landBtn.classList.remove('active');
      return;
    }
    function fallback(){
      if(window.innerHeight > window.innerWidth){ stage.classList.add('rot'); }
      landBtn.classList.add('active');
    }
    var p = goFull();
    function lock(){
      try{
        const ori = screen.orientation as any;
        if(ori && ori.lock){
          return ori.lock('landscape').then(function(){ landBtn.classList.add('active'); }).catch(fallback);
        }
      }catch(e){}
      fallback();
    }
    if(p && p.then){ p.then(lock, lock); } else { setTimeout(lock, 50); }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.play'), function(b){
    b.onclick = function(){
      GAME = b.getAttribute('data-src') || gameUrl;
      start();
    };
  });

  var dlgOv = document.getElementById('dlgOv');
  function openDlg(){ dlgOv.classList.add('open'); }
  function closeDlg(){ dlgOv.classList.remove('open'); }

  document.getElementById('close').onclick = openDlg;
  document.getElementById('dlgCancel').onclick = closeDlg;

  // EXIT LOGIC: EXITS CLEANLY USING REPLACE TO PREVENT BACK-BUTTON REPEAT
  document.getElementById('dlgExit').onclick = function(){
    closeDlg();
    stop();
    returnToCaller();
  };

  dlgOv.onclick = closeDlg;
  document.getElementById('dlg').onclick = function(e){ e.stopPropagation(); };
  landBtn.onclick = landscape;
  document.getElementById('full').onclick = function(){ isFull() ? exitFull() : goFull(); };
  document.getElementById('tog').onclick = function(){ bar.classList.toggle('min'); };
})();

Object.assign(window, { getReturnTarget, returnToCaller });
