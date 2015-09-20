/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

function fullDate(d) {
  var mTable = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return 'on ' + mTable[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  if (typeof(time) == 'number') {
    return 'in ' + String(time);
  }
  var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);
  if ( isNaN(day_diff) || day_diff < 0 )
    return;
      
  return day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    day_diff == 1 && "Yesterday" ||
    day_diff < 7 && day_diff + " days ago" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
    day_diff >= 31 && fullDate(date);
}


var registerHelpers = function(helpersModule) {
	var helpers = helpersModule(Handlebars);

	for (var key in helpers) {
      if (!helpers.hasOwnProperty(key)) continue;
      Handlebars.registerHelper(key, helpers[key]);
    }
};

var render = function(post) {
  var template_name = post.metadata['template'] || 'default';
  // console.log("Rendering pane with template:", template_name)
  if (Templates[template_name]) {
    return Templates[template_name](post);
  } else {
    console.error("Invalide template name: " + template_name);
    return "";
  }
};

var loadJSON = function(path, callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            
            var actual_JSON = JSON.parse(xobj.responseText);
            callback(actual_JSON);
          }
    };
    xobj.send(null);  
 }

module.exports = {
	registerHelpers: registerHelpers,
    render: render,
    loadJSON: loadJSON,
    prettyDate: prettyDate
};