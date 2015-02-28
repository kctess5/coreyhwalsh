var config = {}

config.port = process.env.PORT || 2000;

config.ENV = process.env.ENV || "dev"

config.logging = {
	logParams: true,
	importantParams: ["headers", "method", "params", "query", "body", "protocol", "secure", "ip", "ips", "subdomains", "path", "host"],
	logLogin: false
}
if (config.ENV == "dev") {
	config.logging.importantParams = ["method", "params", "query", "body", "path", "host"]
}

config.blog = {
	"title": "Blog",
	"id": "blog",
	"subheader": "Things I say"
}

module.exports = config;