require('./zepto.min.js');
require('./zepto_fx_methods.js');

$.getJSON( "data/content.json", function( data ) {
	window.data = data;
	require("./main");
}, function(e) {
	console.log("ERROR FETCHING DATA");
});
