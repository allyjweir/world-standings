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
    
var g = svg.append("g");

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

  g.append("g")
      .attr("id", "countries")
    .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("path")
      .attr("d", path)
      .on("click", clicked);
 
  var countries = topojson.feature(world, world.objects.countries).features,
      n = countries.length;

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

var country = svg.selectAll(".country").data(countries);

  country
      .enter()
      .insert("path")
      .attr("class", "country")   
      .attr("id", "countries") 
      .attr("title", function(d) { return d.name; })
      .attr("d", path)
      .on("click", clicked);


  country
	.on("mouseover", function(d) { d3.select(this).style("fill",
	"#9dc1e0"); })
	.on("mouseout", function(d) { d3.select(this).style("fill",
	"#aaa"); });
	
   g.append("path")
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
  
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
