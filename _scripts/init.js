require('./zepto.min.js');

$.getJSON( "data/content.json", function( data ) {
	window.data = data;
	require("./main");
}, function(e) {
	console.log("ERROR FETCHING DATA");
});
