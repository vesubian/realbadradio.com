// radiotitle.js

function radioTitle() {
  var url = 'https://stream.realbadradio.com/json2.txt';
  $.ajax({  type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'parseMusic',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (json) {
          $('#track-title').text(json.title);
          function updateDiscogsLink() {
            const discsearch = 'https://www.discogs.com/search/?q=';
            let disclink = document.getElementById("track-title").textContent;
            document.getElementById("discogs-link").href = discsearch + encodeURIComponent(disclink.replace(/ *\([^)]*\) */g, ""));
          }
          updateDiscogsLink()
      },
        error: function (e) {    console.log(e.message);
      }
  });
}

$(document).ready(function () {
setTimeout(function () {radioTitle();}, 0);
// we're going to update our html elements / player every 15 seconds
setInterval(function () {radioTitle();}, 5000);
});
