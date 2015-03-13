// BASE SETUP
// =============================================================================

// require("long-stack-traces")

// call the packages we need
var express    = require('express');
var app        = express();

var yaml = require('js-yaml');
var fs   = require('fs');

app.use(express.static(__dirname + '/_compiled/'));
app.use(express.logger('dev'));

app.config = yaml.safeLoad(fs.readFileSync('./_config.yml', 'utf8'));

function start() {
	app.listen( app.config.port );
	console.log("server pid %s listening on port %s in %s mode",
		process.pid,
		app.config.port,
		app.get('env')
	);
}

// Only start server if this script is executed, not if it's require()'d.

if (require.main === module) {
	start();
}

exports.app = app;