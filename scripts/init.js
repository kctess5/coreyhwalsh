// console.log(Templates, $)
var helpers = require("./helpers");
var hbsHelpers = require("./handlebars");

helpers.registerHelpers(hbsHelpers);

$.getJSON( "data/data.json", function( data ) {
	window.data = data;
	require("./main");
});
