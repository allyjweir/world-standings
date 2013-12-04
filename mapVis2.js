var width = 1500,
    height = 800,
    centered;

var projection = d3.geo.miller()
    .scale(200)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");
    



svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {

  var countries = topojson.feature(world, world.objects.countries).features,
  	n = countries.length;

  countries = countries.filter(function(d) {
     return names.some(function(n) {
     	if (d.id == n.id) return d.name = n.name;
     });
  }).sort(function(a, b) {
  	return a.name.localeCompare(b.name);
  });

  svg.append("g")
  	.attr("id", "countries")
  	.selectAll("path")
  	.data(countries)
  	.enter().append("path")
  	.attr("d", path)
  	.attr("title", function(d) { return d.name; })
  	.on("click", clicked);

  svg.append("path")
   	.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
   	.attr("id", "country-borders")
   	.attr("d", path);

}

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }
  
  svg.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  svg.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
