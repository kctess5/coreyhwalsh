var getIdentifier = function() {
	var input = window.location.hash;
	var h = input.substr(1).split("/");
	return h.join("");
}

var loadDiscus = function() {
	(function() {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
}

var reloadDiscus = function() {
	DISQUS.reset({
		reload: true,
		config: function () {  
			this.page.identifier = getIdentifier();  
			this.page.url = disqus_url + "#!" + getIdentifier();
		}
	});
}

module.exports.load = function() {
	disqus_shortname = 'rayban-vision';
	disqus_url = window.siteName;
	disqus_identifier = getIdentifier(); // window.location.hash;

	$("#disqus_thread").show();

	if (window.DISQUS) {
		reloadDiscus();
	} else {
        loadDiscus()
	}
}


