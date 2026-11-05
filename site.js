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
// Big screens start it muted when it arrives. Phones wait for a tap, with sound, so nobody pays 16 MB of data for a video they didn't ask for
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

// Anything that moves forever needs a way to stop it. Visitors who asked for less motion get neither the motion nor the button
var still = document.getElementById('still');
if (!calm) {
  still.hidden = false;
  still.addEventListener('click', function () {
    var paused = still.getAttribute('aria-pressed') !== 'true';
    still.setAttribute('aria-pressed', paused);
    document.querySelector('.stage').classList.toggle('paused', paused);
  });
}
