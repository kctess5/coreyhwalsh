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