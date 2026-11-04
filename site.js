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

// Start the trailer, muted, when it scrolls into view; it stays in the visitor's hands after that
var video = document.querySelector('.clip video');
var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calm && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (entries, seen) {
    if (entries[0].isIntersecting) {
      seen.disconnect();
      video.play().catch(function () {});
    }
  }, { threshold: 0.4 }).observe(video);
}
