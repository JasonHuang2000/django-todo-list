// prevent form resubmission
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// scroll to top when refresh
$(document).ready(function () {
  $(this).scrollTop(0);
});
