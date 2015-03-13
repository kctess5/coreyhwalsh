var disqus = require('./disqus');
var utils = require('underscore');

console.log('Hello!');

// $("#content").empty();

var getPanes = function() {
};


var Pane = function(key) {
	this.content = window.data[key];
	this.key = key;
};

var Panes = function(sel, dflt) {
	this.$el = $(sel);
	this.defaultPane = dflt;

	this.render();
};

Panes.prototype.render = function(href) {
	var url = this.getURL(href);
	
	this.getPanes(url);

	this.bind();
};

Panes.prototype.getPane = function(key) {
	if (key in window.data) return new Pane(key);
	else if (key + "/index" in window.data) return new Pane(key + "/index");
};



Panes.prototype.getPanes = function(url) {
	'use strict';
	
	url = url.split('/');
	var panes = [];
	for (var i = 0; i < url.length; i++) {
		var prefix = url.slice(0, i + 1).join("/");
		var pane = this.getPane(prefix);
		// todo: if pane is undefined, push a "not found" pane into the stack
		panes.push(pane);
	}
	return panes;
};

Panes.prototype.getURL = function(href) {
	var url = href || window.location.hash || this.defaultPane;

	var hashbang = url.indexOf('#!/');
	var hashlen  = "#!/".length;

	if (hashbang >= 0) url = url.substring(hashbang + hashlen, url.length);
	
	return url;
};
Panes.prototype.setURL = function(href) {
	window.location = href;
};

Panes.prototype.bind = function() {
	var _this = this;

	$('a').off('click').on('click', function(e) {
		e.preventDefault();

		var href = $(this).attr("href");

		_this.setURL(href);
		_this.render(href);
	});
};

var main = new Panes("#content", 'about');