// radiotitle.js

function radioTitle() {
  const url = 'https://stream.realbadradio.com/title.js';
  
  $.ajax({
    type: 'GET',
    url: url,
    async: true,
    jsonpCallback: 'parseMusic',
    contentType: "application/javascript",
    dataType: 'jsonp',
    timeout: 10000, // 10 second timeout
    success: function (json) {
      if (json && json.title) {
        $('#track-title').text(json.title);
        updateDiscogsLink();
      }
    },
    error: function (xhr, status, error) {
      console.log('Error fetching track info:', error);
      // Fallback: show a default message
      $('#track-title').text('Track information unavailable');
    }
  });
}

function updateDiscogsLink() {
  const discogsSearch = 'https://www.discogs.com/search/?q=';
  const trackTitle = document.getElementById("track-title").textContent;
  
  if (trackTitle && trackTitle !== 'Track information unavailable') {
    // Remove parentheses and their contents, then encode for URL
    const cleanTitle = trackTitle.replace(/ *\([^)]*\) */g, "").trim();
    const encodedTitle = encodeURIComponent(cleanTitle);
    document.getElementById("discogs-link").href = discogsSearch + encodedTitle;
  }
}

$(document).ready(function () {
  // Initial call with a small delay to ensure DOM is ready
  setTimeout(function () {
    radioTitle();
  }, 100);
  
  // Update track info every 5 seconds
  setInterval(function () {
    radioTitle();
  }, 5000);
});
