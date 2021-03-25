// radiotitle.js

function radioTitle() {
    // this is the URL of the json.xml file located on your server.
    var url = 'http://realbadradio.ddns.net:21000/json.xsl';
    // this is your mountpoint's name, mine is called /radio
    var mountpoint = '/mpd.mp3';
    $.ajax({  type: 'GET',
          url: url,
          async: true,
          jsonpCallback: 'parseMusic',
          contentType: "application/json",
          dataType: 'jsonp',
          success: function (json) {
            // this is the element we're updating that will hold the track title
            $('#track-title').text(json[mountpoint].artist + ' - ' + json[mountpoint].title);
            // this is the element we're updating that will hold the listeners count
          //  $('#listeners').text(json[mountpoint].listeners);
        },
          error: function (e) {    console.log(e.message);
        }
    });
}
