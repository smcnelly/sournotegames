// Copy the email address, or select it if the clipboard says no
document.getElementById('copy-email').addEventListener('click', function () {
  var btn = this;
  var email = document.getElementById('email');
  var status = document.getElementById('copy-status');
  var done = function (label) {
    btn.textContent = label;
    status.textContent = 'Email address ' + label.toLowerCase();
    setTimeout(function () { btn.textContent = 'Copy'; status.textContent = ''; }, 1600);
  };
  var select = function () {
    var r = document.createRange();
    r.selectNodeContents(email);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    done('Selected');
  };
  try {
    navigator.clipboard.writeText(email.textContent).then(function () { done('Copied'); }, select);
  } catch (e) { select(); }
});

// The trailer only runs while it's on screen: paused when it's scrolled away, picking up again on the way back
// Big screens start it muted when it arrives. Phones wait for a tap, with sound, so nobody pays 12 MB of data for a video they didn't ask for
var video = document.querySelector('.clip video');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var saving = navigator.connection && navigator.connection.saveData;
var wanted = !calm && !saving && window.matchMedia('(min-width: 700px)').matches;
video.muted = wanted;
video.addEventListener('play', function () { wanted = true; });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      if (wanted) video.play().catch(function () {});
    } else if (!video.paused) {
      video.pause();
    } else if (video.currentTime > 0) {
      wanted = false; // it was already paused as it left, so the visitor did that: don't start it again
    }
  }, { threshold: 0.4 }).observe(video);
}

// The story's little clips play while they're on screen, unless the visitor asked for calm or is saving data, and each has its own pause
document.querySelectorAll('.loop').forEach(function (shot) {
  var clip = shot.querySelector('video');
  var hold = shot.querySelector('button');
  var on = !calm && !saving;
  clip.muted = true;
  var show = function () { hold.textContent = on ? 'Pause' : 'Play'; };
  show();
  hold.addEventListener('click', function () {
    on = !on;
    show();
    if (on) clip.play().catch(function () {}); else clip.pause();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && on) clip.play().catch(function () {});
      else clip.pause();
    }, { threshold: 0.4 }).observe(clip);
  }
});
