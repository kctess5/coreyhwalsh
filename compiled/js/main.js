(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var helpers  = require('./index');
// var moment   = require('moment');

module.exports = function(Handlebars) {
	var oldEach = Handlebars.helpers.each;
	Handlebars.logger.level = 0;
	return {
		downcase: function(string){
			return new Handlebars.SafeString(string.toLowerCase());
		},
		conditional: function(context, options){
			if (options) {
				options = options.hash;
			}

			if (context) {
				return new Handlebars.SafeString(options.truely || "");
			} else {
				return new Handlebars.SafeString(options.falsely);
			}
		},
		url: function(l){
			return new Handlebars.SafeString(l);
		},
		breaklines: function(text) {
			text = Handlebars.Utils.escapeExpression(text);
			text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
			return new Handlebars.SafeString(text);
		},
		times: function(n, block) {
			var accum = '';
			for(var i = 0; i < n; ++i)
				accum += block.fn(i);
			return accum;
		},
		// timeAgo: function(timestamp){
		// 	return moment(timestamp).fromNow();
		// },
		parseDur: function(duration) {
			return helpers.prettyDuration(duration);
		},
		img: function(url, options) {
			options = options.hash || {};
			var c = options.class || ""
			var i = options.id || ""
			var href = options.href || null;
			if (href) {
				return "<a href='" + href + "'><img src='/img/" + url + "' class='" + c + "' id='" + i + "'></a>"
			} else {
				return "<img src='/img/" + url + "' class='" + c + "' id='" + i + "'>"
			}	
		},
		reverse: function(context){
			var options = arguments[arguments.length - 1];
			var ret = '';

			if (context && context.length > 0) {
				for (var i = context.length - 1; i >= 0; i--) {
					ret += options.fn(context[i]);
				}
			} else {
				ret = options.inverse(this);
			}

			return ret;
		},
		target: function(target) {
			return target || "_self";
		},
		join: function(arr) {
			return arr.constructor === Array ? arr.join("") : arr;
		},
		copyright: function(year) {
			return new Handlebars.SafeString("&copy;" + year);
		},
		ifExists: function(v1, options) {
			return v1 ? options : "";
		},
		ifCond: function(v1, operator, v2, options) {
			switch (operator) {
	        case '==':
	            return (v1 == v2) ? options : "";
	        case '===':
	            return (v1 === v2) ? options : "";
	        case '<':
	            return (v1 < v2) ? options : "";
	        case '<=':
	            return (v1 <= v2) ? options : "";
	        case '>':
	            return (v1 > v2) ? options : "";
	        case '>=':
	            return (v1 >= v2) ? options : "";
	        case '&&':
	            return (v1 && v2) ? options : "";
	        case '||':
	            return (v1 || v2) ? options : "";
	        default:
	            return "";
	    }
		}
	};
};


},{}],2:[function(require,module,exports){
var registerHelpers = function(helpersModule) {
	var helpers = helpersModule(Handlebars);

	for (var key in helpers) {
      if (!helpers.hasOwnProperty(key)) continue;
      Handlebars.registerHelper(key, helpers[key]);
    }
}

var compileTemplate = function(name, template) {
	template = template || name;
	return  Templates[template] ? Templates[template](data[name]): null;
}

module.exports = {
	registerHelpers: registerHelpers,
	compileTemplate: compileTemplate
}
},{}],3:[function(require,module,exports){
// console.log(Templates, $)
var helpers = require("./helpers");
var hbsHelpers = require("./handlebars");

helpers.registerHelpers(hbsHelpers);

$.getJSON( "data/data.json", function( data ) {
	window.data = data;
	require("./main");
});

},{"./handlebars":1,"./helpers":2,"./main":4}],4:[function(require,module,exports){
var helpers = require("./helpers");
var sidebar = helpers.compileTemplate("sidebar");
var hash = window.location.hash.substr(1).split("/");

function OpenInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

var updateSidebar = function(id) {
	$( "#sidebar .link" ).removeClass("active")
	$( "#sidebar #" + id.replace(/[^a-zA-Z_ ]/g, "") ).addClass("active")
}

var replaceAndScroll = function(el, html) {
	$(el).html(html).hide();
	setTimeout(function(){ // really strange hack... doesn't work (always) without it... idk man
		$(document).scrollTop(0);
	}, 0)
	$(el).fadeIn(200)
}
var swapFor = function(id, template) {
	if (data[id]) {
		var html = helpers.compileTemplate(id, template);
		updateSidebar(id);
		replaceAndScroll("#content .content", html)
	}
}

var loadDetails = function(pageId, articleId, template) {
	$("#content .content").css("width", "50%");

	var template = Templates[template],
		articles = data[pageId].articles;

	var article = $.grep(articles, function(el){
		return el.id == articleId;
	})[0];

	if (template && article) {
		var html = template(article);
		replaceAndScroll("#content .detailed-content", html)
	}
	resizeContent()
}

var hideDetails = function() {
	$("#content .detailed-content").hide();
	$("#content .content").css("width", "100%");
}

var smallWidth = function(e) {
	if ($("#content .content").outerWidth() < 125) {
		console.log("hide")
		e.stopPropagation(); 
		e.preventDefault(); 
		hideDetails();
		return true;
	}
}

var reset = function(){
	console.log("reset")
	$("body").css("padding-left", "");
}

var bind = function() {
	$(".article.detailed").click(function(e) {
		if (smallWidth(e)) return;
		var pageId = $(this).parent("div").attr("class");
		var articleId = $(this).attr("id");
		window.location.hash = "#"+pageId+"/"+articleId;
		if ($(window).width() < 745) {
			minimizeSidebar(true);
		}
		loadDetails(pageId, articleId, "details")
	});
	$(".article.linked").click(function(e) {
		if (smallWidth(e)) return;
		var href = $(e.target).attr("href");
		if (!href) { // didn't click on link
			var url = $(this).find("a").attr("href")
			OpenInNewTab(url);
		}
	});
	$("#menu-icon").click(function(e){
		$("#sidebar").toggleClass("active");
		var isActive = $("#sidebar").hasClass("active");
		$("body").css("padding-left", isActive ? "180px" : "");
	});
	$("#content .content").click( function( e ) {
		var parent = $(e.target).parents('.detailed').get()[0];
		var isArticle = $(e.target).is(".detailed");

		if ( parent == undefined && !isArticle ) hideDetails();
	});

}

var resizeContent = function() {
	var windowWidth = $(window).width();
	var width = $("#content .content").css("width");
	var detailed = $(".detailed-content");
	if (detailed.is(":visible")) {
		if (windowWidth < 560) {
			var target = windowWidth - detailed.outerWidth();
			$("#content .content").css("width", target);
		} else {
			$("#content .content").css("width", "50%");
		}
	}
	if (windowWidth > 744) {
		reset();
	}
}

var minimizeSidebar = function(cond) {
	$("body").css("padding-left", cond ? "0px" : "");
	$("#sidebar").removeClass("active");
	if (cond) $("#sidebar").fadeOut(100);
}

$("#sidebar").append(sidebar)
if (hash[0]) swapFor(hash[0], "content");
else swapFor("about", "content"); // default to about page

if (hash[1]) loadDetails(hash[0],hash[1], "details");
bind();
resizeContent();

$(".link").click(function() {
	var id = $(this).attr("id");
	console.log($("#sidebar").hasClass("active"),  $(window).width() < 460)
	if ($("#sidebar").hasClass("active") && $(window).width() < 460) {
		minimizeSidebar();
	}
	hideDetails();
	swapFor(id, "content")
	bind();
})

$( window ).resize(resizeContent);

},{"./helpers":2}]},{},[3]);
