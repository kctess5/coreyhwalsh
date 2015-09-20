var helpers = require("./helpers");
var hbsHelpers = require("./hbs_helpers");
var layouts = require('./layouts');

$SIDEBAR = $("#sidebar");
$CONTENT = $("#content");
var is_custom_initiated = false;
var sidebar_showing = false;

var getURL = function(input) {
	input = input || window.location.hash;
	return input.substr(1).split("/");
};

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

function setUrl(ids) {
	is_custom_initiated = true;
	window.location.hash = "#" + ids.join("/");
}

function open(ids, data) {
	// remove ids for which we don't have a pane
	ids = ids.filter(function(id) { return id in data; });

	if (ids.length == 0) {
		ids = ['about'];
	}
	// render each id into its corresponding HTML
	var panes = ids.map(function(id) {
		return helpers.render(data[id]);
	});

	//TODO(coreywalsh) replace this with a diff based renderer
	$CONTENT.empty(); // remove old panes
	// inject new panes
	for (pane in panes) {
		$CONTENT.append(panes[pane]);
	}
	// window.onhashchange = function() {};
	setUrl(ids);
	layoutPanes();
	bindEvents(ids, data);
}

function navigateTo(ids) {
	window.location.hash = "#" + ids.join("/");
}

function init() {
	helpers.registerHelpers(hbsHelpers);
	helpers.loadJSON("data/posts.json", function(obj) {
		load_sidebar(obj);
		open(getURL(), obj);
	});
}

function load_sidebar(data) {
	$SIDEBAR.append(data['sidebar'].content);
}

function layoutPanes() {
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
			$(this).css("left", layout[i].l);
			$(this).css("right", viewportWidth - layout[i].r);
		});
	}
}

function contains(letter, string) {
	return string.indexOf(letter) >= 0;
}

function findParentId(el) {
	var p = $(el).closest('.pane');
	if (p) {
		return p.attr('id');
	}
	return null;
}

function bindEvents(current_ids, data) {
	// handle link clicks inside panes
	$('a').off('click').click(function(e) {
		var $link = $(e.target).closest('a');
		var target = $link.attr('target');
		var url = $link.attr('href');
		var pid = findParentId(e.target);

		if (target == "_blank") {
			return;
		}
		if (contains("/", url)) {
			open(getURL(url), data);
			e.preventDefault();
		} else if (contains("#", url)) {
			var tree_base = current_ids.indexOf(pid);
			open(current_ids.slice(0, tree_base + 1).concat(getURL(url)), data);
			e.preventDefault();
		}
	});
	$(".pane img:not(.external-icon)").off("click").click(function(e) {
		var image = e.currentTarget.currentSrc;
		$("#lightbox-container").show();
		$("#lightbox").css("background-image", "url("+image+")");
	});
	$("#lightbox-container").off("click").click(function(){
		$(this).hide();
	});
	// focus on 
	$('.pane').off('click').click(function(e) {
		if (sidebar_showing) {
			$SIDEBAR.removeClass('unhidden');
			sidebar_showing = false;
		}
		var $parent = $(e.target).closest('.detailed');
		var targets = parent ? [$parent.data("target")] : [];
		var pid = findParentId(e.target);
		var tree_base = current_ids.indexOf(pid) + 1;
		if (tree_base != current_ids.length) {
			open(current_ids.slice(0, tree_base).concat(targets), data);
		}
	});

	$("#menu-icon").click(function() {
		$SIDEBAR.toggleClass('unhidden');
		sidebar_showing = $SIDEBAR.hasClass('unhidden');
	});

	window.onhashchange = function() {
		if (!is_custom_initiated) {
			open(getURL(), data);
		}
		is_custom_initiated = false;
	};
}

$( window ).resize(function() {
	layoutPanes();
});

init();

