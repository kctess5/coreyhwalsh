console.log("main");

var helpers = require("./helpers");
var sidebar = helpers.compileTemplate("sidebar");
var hash = window.location.hash.substr(1).split("/");

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

	console.log(article);

	if (template && article) {
		var html = template(article);
		// console.log(html)
		replaceAndScroll("#content .detailed-content", html)
	}
}

var hideDetails = function() {
	$("#content .detailed-content").hide();
	$("#content .content").css("width", "100%");
}

var bind = function() {
	$(".article.detailed").click(function() {
		var pageId = $(this).parent("div").attr("class");
		var articleId = $(this).attr("id");
		window.location.hash = "#"+pageId+"/"+articleId;
		loadDetails(pageId, articleId, "details")
	});
	$(".article.linked").click(function(e) {
		var href = $(e.target).attr("href");
		if (!href) { // didn't click on link
			var url = $(this).find("a").attr("href")
			OpenInNewTab(url);
		}
	});
}


$("#sidebar").append(sidebar)
if (hash[0]) swapFor(hash[0], "content");
else swapFor("about", "content"); // default to about page

if (hash[1]) loadDetails(hash[0],hash[1], "details");
bind();


$(".link").click(function() {
	var id = $(this).attr("id");
	hideDetails();
	swapFor(id, "content")
	bind();
})

function OpenInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


