// discogs link
var url = new URL('https://www.discogs.com/search/?q=');
var search_params = url.searchParams;

// new value of "id" is set to "101"
search_params.set('q', '101');

// change the search property of the main url
url.search = search_params.toString();

// the new url string
var new_url = url.toString();

// output : http://demourl.com/path?id=101&topic=main
console.log(new_url);

function updateDiscogsLink() {
  document.getElementById("discogs-link").href = 'https://www.discogs.com/search/?q=' + document.getElementById("track-title").innerHTML;
}
updateDiscogsLink()
