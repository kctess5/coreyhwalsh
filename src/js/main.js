var helpers = require("./helpers");
var hbsHelpers = require("./hbs_helpers");
var layouts = require('./layouts');
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// var ga = require('./ga').ga;
var debug = false;
var last_debug = true;

function setDebugMode(shouldDebug) {
	if (shouldDebug) 
		debug = console.log.bind(console);
	else debug = function() {};
	if (shouldDebug != last_debug) {
		last_debug = shouldDebug;
		console.log("Setting debug mode:", shouldDebug);
	}
}

function test() {
	debug("Running tests");
	var tests = [];

	// tests for strip_parameters
	tests.push(function(errs) {
		if (strip_parameters("test?other") !== "test") 
			errs.push("'strip_parameters' failed to strip parameters correctly: test?other -> " + strip_parameters("test?other"));
		if (strip_parameters("test") !== "test") 
			errs.push("'strip_parameters' mangles property without: test -> " + strip_parameters("test"));
		return errs;
	});

	// tests for contains
	tests.push(function(errs) {
		if (contains("?", "test?other") !== true) 
			errs.push("'contains' does not return true when the given element is present: contains('?', 'test?other')-> " + contains("?", "test?other"));
		if (contains("?", "test") !== false) 
			errs.push("'contains' returns true when the string does not contain the query: contains('?', 'test') -> " + contains('?', 'test'));
		return errs;
	});

	// tests for serialize_parameters
	tests.push(function(errs) {
		if (serialize_parameters({'test': 'val'}) !== "test=val") 
			errs.push("'serialize_parameters' fails to join single param correctly: serialize_parameters({'test': 'val'}) -> " 
						+ serialize_parameters({'test': 'val'}));
		if (serialize_parameters({'test': 'val', 'test2': 'val2'}) !== "test=val&test2=val2") 
			errs.push("'serialize_parameters' fails to join two params correctly: serialize_parameters({'test': 'val', 'test2': 'val2'}) -> " 
						+ serialize_parameters({'test': 'val', 'test2': 'val2'}));
		if (serialize_parameters({}))
			errs.push("'serialize_parameters' fails with no params: serialize_parameters({}) -> " + serialize_parameters({}));
		return errs;
	});


	var errs = [];
	for (var i = 0; i < tests.length; i++) {
		tests[i](errs);
	}

	if (errs.length == 0) {
		console.log("All tests passed!");
	} else {
		console.log("Failed at least one test!");
		for (var i = 0; i < errs.length; i++) {
			console.log(errs[i]);
		}
	}
}

function reload_selectors () {
	debug("Reloading static Zepto selectors.");
	$SIDEBAR = $("#sidebar");
	$SIDEBAR_OPTIONS = $SIDEBAR.find(".link").not("a[target=_blank] .link");
	$CONTENT = $("#content");
}

var is_custom_initiated = false;

var has_parameters = function(url) {
	return url && contains("?", url);
};

var strip_parameters = function(url) {
	if (!has_parameters(url)) return url;
	var index = url.indexOf("?");
	if (index) return url.substring(0, index);
	return url;
};

var getParameters = function(url) {
	input = url || window.location.hash;
	if (debug) debug("Getting URL parameters from:", input);
	var parameters = {};
	if (!has_parameters(input)) return parameters;
	var index = input.indexOf("?");
	if (index) {
		var parts = input.substring(index + 1).split("&");

		for (var i = 0; i < parts.length; i++) {
			var subparts = parts[i].split("=");

			if (subparts.length !== 2) {
				if (debug) debug("Failed to parse parameter subparts:", parts[i], "->", parts[i].split("="));
				continue;
			}
			parameters[subparts[0]] = subparts[1];
		};
	};
	return parameters;
};

// add in parameters from the URL bar that are supposed to be maintained across local links
function add_persistent_parameters(params) {
	var current_params = getParameters();
	var persisent_params = (current_params["keep_params"] ? current_params : {});

	for (var key in persisent_params) {
		params[key] = persisent_params[key];
	}

	return params;
}

var getURL = function(input) {
	input = input || window.location.hash;
	if (has_parameters(input)) input = strip_parameters(input);
	return input.substr(1).split("/");
};

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

function setUrl(ids, parameters) {
	debug("Custom initiated URL change.");
	is_custom_initiated = true;
	navigateTo(ids, parameters);
}

function open(ids, data, parameters) {
	// set debug mode to on if the debug=1 flag is on
	setDebugMode(isEmpty(parameters) ? false : (parameters.debug == 1));

	debug("Opening ids:", ids, "with parameters:", parameters);
	// remove ids for which we don't have a pane
	ids = ids.filter(function(id) { return id in data; });

	if (ids.length == 0) {
		ids = ['about'];
	}

	debug("Rendering panes:", ids);
	// render each id into its corresponding HTML
	var panes = ids.map(function(id) {
		return helpers.render(data[id]);
	});

	//TODO(coreywalsh) replace this with a diff based renderer
	$CONTENT.empty(); // remove old panes
	// inject new panes
	for (pane in panes) {
		$CONTENT.append(panes[pane]);
		// load any javascripts specified by the 'scripts' parameter of the metadata
		load_scripts(data[ids[pane]]);
	}
	// window.onhashchange = function() {};
	setUrl(ids, parameters);
	layoutPanes();
	updateSidebar(ids);
	bindEvents(ids, data);
	
	ga('send', 'pageview', {
 		'page': location.pathname + location.search  + location.hash
	});
}

// Update the sidebar after the panes change. Currently this:
// 		- underlines any top level classes if they are active
function updateSidebar(ids) {
	debug("Updating sidebar underlines.");
	$SIDEBAR_OPTIONS.each(function() {
		$(this).removeClass("active");
		if (contains($(this).attr("id"), ids)) $(this).addClass("active");
	});
}

function _load_scripts(scripts) {
	$.getScript(scripts[0], function(){
		debug('Fetched Script:', scripts[0]);
		scripts.shift();
		if (scripts.length > 0) {
			_load_scripts(scripts);
		}
	});
}

// load the script for a post, as specified by the 'script' metadata attribute
function load_scripts(data) {
	if (data.metadata && data.metadata.script) {
		if (data.metadata.script.constructor === Array) {
			_load_scripts(data.metadata.script)
		} else {
			_load_scripts([data.metadata.script]);
		}
	}
}

function serialize_parameters(params) {
	var parts = [];
	for (var key in params) {
		parts.push(key + "=" + params[key]);
	}
	return parts.join("&");
}

function navigateTo(ids, parameters) {
	var new_hash = "#" + ids.join("/") + (isEmpty(parameters) ?  "" : "?" + serialize_parameters(parameters));
	debug("Navigating to: " + new_hash);
	window.location.hash = new_hash;
}

function init() {
	setDebugMode(isEmpty(getParameters()) ? false : (getParameters().debug == 1));
	debug("Initializing.");
	ga('create', 'UA-47443701-4', 'auto');
	reload_selectors();
	helpers.registerHelpers(hbsHelpers);
	helpers.loadJSON("data/posts.json", function(obj) {
		load_sidebar(obj);
		reload_selectors();
		open(getURL(), obj, getParameters());
	});
}

function load_sidebar(data) {
	debug("Loading sidebar.");
	$SIDEBAR.append(data['sidebar'].content);
}

function hide_sidebar(data) {
	debug("Hiding sidebar.");
	$SIDEBAR.removeClass('unhidden');
}

function showing_sidebar() {
	debug("Showing sidebar.");
	return $SIDEBAR.hasClass('unhidden');
}

function layoutPanes() {
	debug("Laying out panes.");
	var viewportWidth = $CONTENT.width();
	var panes = $CONTENT.children('div').length;

	var settings = {
		minWidth: 300,
		targetWidth: 500,
		maxWidth: 800,
		targetPreview: 80,
		minPreview: 60,
	};

	var ol = new layouts.Optimal(panes, {
		minWidth: 400,
		targetWidth: 500,
		maxWidth: 800,
		targetPreview: 60,
		minPreview: 50,
	});
	
	var fl = new layouts.Folded(panes, settings);
	var ml = new layouts.Mobile(panes, settings);

	var layout = ol.makeLayout(viewportWidth) || 
				 fl.makeLayout(viewportWidth) ||
				 ml.makeLayout(viewportWidth);

	if (layout) {
		$CONTENT.children('div').each(function(i) {
			$(this).css("left", layout.dims[i].l);
			$(this).css("right", viewportWidth - layout.dims[i].r);
			$(this).attr("layout", layout.flavor);
		});
	}
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function contains(elem, list) {
	return list.indexOf(elem) >= 0;
}

function findParentId(el) {
	var p = $(el).closest('.pane');
	if (p) {
		return p.attr('id');
	}
	return null;
}

function OpenInNewTab(url) {
	debug("Opening in new tab: " + url);
	var win = window.open(url, '_blank');
	win.focus();
}

function bindEvents(current_ids, data) {
	debug("Rebinding events.");
	// handle link clicks inside panes
	$('a').off('click').click(function(e) {
		debug("Handling click event.")
		var $link = $(e.target).closest('a');
		var target = $link.attr('target');
		var url = $link.attr('href');
		var pid = findParentId(e.target);

		if (target == "_blank") {
			return;
		}
		if (contains("http", url.slice(0,6))) {
			OpenInNewTab(url);
			e.preventDefault();
			return;
		}

		var parameters = getParameters(url);
		parameters = add_persistent_parameters(parameters);

		if (contains("/", url)) {
			open(getURL(url), data, parameters);
			e.preventDefault();
		} else if (contains("#", url)) {
			var tree_base = current_ids.indexOf(pid);
			open(current_ids.slice(0, tree_base + 1).concat(getURL(url)), data, parameters);
			e.preventDefault();
		}

		// hide mobile sidebar when link is clicked
		if($(e.target).parents('#sidebar').length > 0) {
			hide_sidebar();
		}
	});
	$(".pane img:not(.external-icon):not(.no-lightbox)").off("click").click(function(e) {
		var image = e.currentTarget.currentSrc;
		$("#lightbox-container").show();
		$("#lightbox").css("background-image", "url("+image+")");
	});
	$("#lightbox-container").off("click").click(function(){
		$(this).hide();
	});
	// focus on 
	$('.pane').off('click').click(function(e) {
		if (showing_sidebar()) {
			hide_sidebar();
		}
		var $parent = $(e.target).closest('.detailed');
		var targets = parent ? [$parent.data("target")] : [];
		var pid = findParentId(e.target);
		var tree_base = current_ids.indexOf(pid) + 1;
		if (tree_base != current_ids.length) {
			open(current_ids.slice(0, tree_base).concat(targets), data, getParameters());
		}
	});

	$("#menu-icon").click(function() {
		$SIDEBAR.toggleClass('unhidden');
	});

	window.onhashchange = function() {
		if (!is_custom_initiated) {
			open(getURL(), data, getParameters());
		}
		is_custom_initiated = false;
	};
}

$( window ).resize(function() {
	layoutPanes();
});

init();
test();

