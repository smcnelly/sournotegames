// Copy the email address, or select it if the clipboard says no
document.getElementById('copy-email').addEventListener('click', function () {
  var btn = this;
  var email = document.getElementById('email');
  var done = function (label) { btn.textContent = label; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
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

// The trailer only runs while it's on screen: muted when it first arrives, paused when it's scrolled away, picking up again on the way back
var video = document.querySelector('.clip video');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var wanted = !calm;
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
