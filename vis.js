var feature // eventually: all svg paths (countries) of the world
  , toggle; // animation on/off control

var projection = d3.geo.azimuthal()
    .scale(380)
    .origin([0,0])
    .mode("orthographic")
    .translate([400, 400]);

var circle = d3.geo.greatCircle()
    .origin(projection.origin());

var width = 1500,
    height = 800,
    centered;
    
var scale = 380;

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#body").append("svg:svg")
    .attr("width",  800)
    .attr("height", 800);
   
   
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", function() {if (done) startAnimation(); else stopAnimation();});
    
var g = svg.append("g");

if (frameElement) frameElement.style.height = '800px';

d3.json("world-countries.json", function(collection) {
  feature = svg.selectAll("path")
		  .data(collection.features)
		  .enter().append("svg:path")
		  .on("mouseover", function(d) { d3.select(this).style("fill",
		  "#9dc1e0"); })
		  .on("mouseout", function(d) { d3.select(this).style("fill",
		  "#aaa"); })
		  .on("mousedown", clicked)      
		  .attr("d", clip);
      
  feature.append("svg:title")
      .text(function(d) { return d.properties.name; });

  startAnimation();

});

function stopAnimation() {
  done = true;
}

function startAnimation() {
  done = false;
  d3.timer(function() {
    var origin = projection.origin();
    origin = [origin[0] + 1, origin[1] + 0];
    projection.origin(origin);
    circle.origin(origin);
    refresh();
    return done;
  });
}


var done;

function refresh(duration) {
  (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
}

function clip(d) {
  return path(circle.clip(d));
}

function reframe(css) {
  for (var name in css)
    frameElement.style[name] = css[name] + 'px';
}

function clicked(d) {
   stopAnimation();  
   p = projection.invert(d3.mouse(this));
   console.log(p);                                                          
   var origin = projection.origin();
   origin = [p[0], p[1]];
   projection.origin(origin);
   circle.origin(origin);
   refresh();
   svg.selectAll("path").attr("d", path);
   refresh();
   
}
