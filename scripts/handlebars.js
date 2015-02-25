// var helpers  = require('./index');
// var moment   = require('moment');

var getIdentifier = function() {
	var input = window.location.hash;
	var h = input.substr(1).split("/");
	return h.join("");
}

module.exports = function(Handlebars) {
	var oldEach = Handlebars.helpers.each;
	Handlebars.logger.level = 0;
	return {
		disqus_identifier: function() {
			return getIdentifier();
		},
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

