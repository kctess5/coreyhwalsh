'use strict';

var disqus = require('./disqus');

console.log('Hello!');

var Pane = function(key) {
	this.$content = $(window.data[key]);
	this.key = key;

	this.bind();
};

Pane.prototype.inject = function($el, last) {
	// if (last) this.$content.css('opacity', 0);
	$el.append(this.$content);
	// if (last) this.$content.fadeIn(100);
};

Pane.prototype.only = function() {
	this.$content.addClass('only');
};

Pane.prototype.bind = function() {
	var pane = this;
	this.$content.find('#show-comments').off('click').click(function() {
		disqus.load(pane);
		$(this).hide();
	});
};

var Panes = function(sel, dflt) {
	this.$el = $(sel);
	this.defaultPane = dflt;
};

Panes.prototype.render = function(href) {
	var url = this.getURL(href);
	
	var panes = this.getPanes(url);

	this.$el.empty();

	for (var i = 0; i < panes.length; i++) {
		panes[i].inject(this.$el, i === panes.length - 1);
	}

	if (panes.length === 1) panes[0].only();

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

	$('a').off('click').click(function(e) {
		var href = $(this).attr("href");

		if ($(this).attr('target') === "_blank") return

		e.preventDefault();

		_this.setURL(href);
		_this.render(href);
	});
};

var main = new Panes("#content", 'about');
main.render();