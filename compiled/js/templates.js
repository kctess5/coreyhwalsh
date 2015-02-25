this["Templates"] = this["Templates"] || {};

this["Templates"]["class"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<a target=\"_blank\" href=\""
    + escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"href","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n			<img class=\"external-icon\" src=\"/assets/external1.png\"></a>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "			";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div>\n	<h2 class=\"title\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.href : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</h2>\n	<p>Course Number: "
    + escapeExpression(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "</p>\n	<p>Course Title: "
    + escapeExpression(((helper = (helper = helpers['course-name'] || (depth0 != null ? depth0['course-name'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"course-name","hash":{},"data":data}) : helper)))
    + "</p>\n	<p>Credits: "
    + escapeExpression(((helper = (helper = helpers.units || (depth0 != null ? depth0.units : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"units","hash":{},"data":data}) : helper)))
    + "</p>\n	";
  stack1 = ((helpers.join || (depth0 && depth0.join) || helperMissing).call(depth0, (depth0 != null ? depth0.description : depth0), {"name":"join","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n</div>";
},"useData":true});

this["Templates"]["content"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "		<h3 class=\"subheader\">...";
  stack1 = ((helper = (helper = helpers.subheader || (depth0 != null ? depth0.subheader : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"subheader","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</h3>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "		";
  stack1 = ((helpers.join || (depth0 && depth0.join) || helperMissing).call(depth0, (depth0 != null ? depth0.body : depth0), {"name":"join","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.articles : depth0), {"name":"each","hash":{},"fn":this.program(6, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"6":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "		<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-template=\""
    + escapeExpression(((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"template","hash":{},"data":data}) : helper)))
    + "\" class=\"article "
    + escapeExpression(((helpers.ifExists || (depth0 && depth0.ifExists) || helperMissing).call(depth0, (depth0 != null ? depth0.detailed : depth0), "detailed", {"name":"ifExists","hash":{},"data":data})))
    + " "
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)))
    + "\">\n			<h3 class=\"article-title\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.detailed : depth0), {"name":"if","hash":{},"fn":this.program(7, data, depths),"inverse":this.program(9, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			</h3>\n			<p  class=\"article-description\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</p>\n		</div>\n";
},"7":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "				<a class=\"details\" href=\"#"
    + escapeExpression(lambda((depths[2] != null ? depths[2].id : depths[2]), depth0))
    + "/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</a>\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "				";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div id=\"container\" class=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n	<a id=\"menu-icon\">\n		<img src=\"/assets/menu27.png\">\n		<h3>Menu</h3><br>\n	</a>\n	<h2 class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.subheader : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.body : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.articles : depth0), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"useData":true,"useDepths":true});

this["Templates"]["details"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<a target=\"_blank\" href=\""
    + escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"href","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n			<img class=\"external-icon\" src=\"/assets/external1.png\"></a>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "			";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div>\n	<h2 class=\"title\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.href : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</h2>\n\n	";
  stack1 = ((helpers.join || (depth0 && depth0.join) || helperMissing).call(depth0, (depth0 != null ? depth0.detailed : depth0), {"name":"join","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n	<div id=\"show-comments\"><p>Show Comments</p><span class=\"disqus-comment-count\" data-disqus-identifier=\""
    + escapeExpression(((helpers.disqus_identifier || (depth0 && depth0.disqus_identifier) || helperMissing).call(depth0, "test", {"name":"disqus_identifier","hash":{},"data":data})))
    + "\"></span></div>\n\n	<div id=\"disqus_thread\"></div>\n</div>\n\n";
},"useData":true});

this["Templates"]["sidebar"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<div class=\"link-container\">\n				<h3 id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"link\"><a "
    + escapeExpression(((helpers.ifExists || (depth0 && depth0.ifExists) || helperMissing).call(depth0, (depth0 != null ? depth0.blank : depth0), "target='_blank'", {"name":"ifExists","hash":{},"data":data})))
    + " href=\""
    + escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"href","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</a></h3>\n			</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div>\n	<h1 class=\"main title\"><a href=\"/\">";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</a></h1>\n	<div id=\"top-links\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.toplinks : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</div>\n	\n	<div id=\"bottom-links\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.bottomlinks : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</div>\n\n</div>";
},"useData":true});