var helpers = require("./helpers");
var sidebar = helpers.compileTemplate("sidebar");
var getURL = function(input) {
	input = input || window.location.hash;
	return input.substr(1).split("/");
}
var hash = getURL();

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
	}, 0);
	$(document).scrollTop(0);
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
	resizeContent();
	bind();
}

var hideDetails = function() {
	$("#content .detailed-content").hide();
	$("#content .content").css("width", "100%");
}

var smallWidth = function(e) {
	if ($("#content .content").outerWidth() < 125) {
		e.stopPropagation(); 
		e.preventDefault(); 
		hideDetails();
		return true;
	}
}

var reset = function(){
	$("body").css("padding-left", "");
}

var bind = function() {
	$(".article.detailed").off("click").click(function(e) {
		if (smallWidth(e)) return;
		var pageId = $(this).parent("div").attr("class");
		var articleId = $(this).attr("id");
		window.location.hash = "#"+pageId+"/"+articleId;
		if ($(window).width() < 745) {
			minimizeSidebar(true);
		}
		loadDetails(pageId, articleId, "details")
	});
	$(".article.linked").off("click").click(function(e) {

		if (smallWidth(e)) return;
		var href = $(e.target).attr("href");
		if (!href) { // didn't click on link
			var url = $(this).find("a").attr("href")
			OpenInNewTab(url);
		}
	});
	$("#menu-icon").off("click").click(function(e){
		$("#sidebar").toggleClass("active");
		var isActive = $("#sidebar").hasClass("active");
		$("body").css("padding-left", isActive ? "180px" : "");
	});
	$("#content .content").off("click").click( function( e ) {
		var parent = $(e.target).parents('.detailed').get()[0];
		var isArticle = $(e.target).is(".detailed");

		if ( parent == undefined && !isArticle ) hideDetails();
	});
	$(".meta").off("click").click(function(){
		var h = $(this).attr("href");
		var url = getURL(h);
		if (url[0]) open(url);
	});
	$("img").off("click").click(function(e){
		var image = e.currentTarget.currentSrc;
		$("#lightbox-container").show();
		$("#lightbox").css("background-image", "url("+image+")");
	});
	$("#lightbox-container").off("click").click(function(){
		$(this).hide();
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

$("#sidebar").append(sidebar);

var open = function(loc) {
	if (loc[0]) swapFor(loc[0], "content");
	else swapFor("about", "content"); // default to about page

	if (loc[1]) loadDetails(loc[0],loc[1], "details");
	bind();
}

open(hash)
resizeContent();

$(".link").click(function() {
	var id = $(this).attr("id");
	if ($("#sidebar").hasClass("active") && $(window).width() < 460) {
		minimizeSidebar();
	}
	hideDetails();
	swapFor(id, "content")
	bind();
})

$( window ).resize(resizeContent);
