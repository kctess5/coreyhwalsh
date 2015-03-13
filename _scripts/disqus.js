var getIdentifier = function() {
	var input = window.location.hash;
	var h = input.substr(3).split("/");
	return h.join("");
};

var loadDiscus = function() {
	'use strict';
	
	(function() {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
};

var reloadDiscus = function() {
	DISQUS.reset({
		reload: true,
		config: function () {  
			this.page.identifier = window.disqus_identifier;  
			this.page.URL = this.page.url = window.siteName + "#!" + window.disqus_identifier;
		}
	});
};

module.exports.load = function(pane) {
	window.disqus_shortname = 'rayban-vision';
	window.disqus_url = window.siteName;
	window.disqus_identifier = getIdentifier() + "X"; // window.location.hash;

	pane.$content.find("#disqus_thread").show();

	if (window.DISQUS) {
		reloadDiscus();
	} else {
        loadDiscus();
	}
};


