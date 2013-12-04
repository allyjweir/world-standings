var feature // eventually: all svg paths (countries) of the world
  , toggle; // animation on/off control

var projection = d3.geo.azimuthal()
    .scale(380)
    .origin([-71.03,42.37])
    .mode("orthographic")
    .translate([400, 400]);

var circle = d3.geo.greatCircle()
    .origin(projection.origin());

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);
    
var scale = 380;

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#body").append("svg:svg")
    .attr("width",  800)
    .attr("height", 800)

if (frameElement) frameElement.style.height = '800px';

d3.json("world-countries.json", function(collection) {
  feature = svg.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", clip);

  feature.append("svg:title")
      .text(function(d) { return d.properties.name; });

  startAnimation();
  d3.select('#animate').on('click', function () {
    if (done) startAnimation(); else stopAnimation();
  });
});

function stopAnimation() {
  done = true;
  d3.select('#animate').node().checked = false;
}

function startAnimation() {
  done = false;
  d3.timer(function() {
    var origin = projection.origin();
    origin = [origin[0] + .18, origin[1] + .06];
    projection.origin(origin);
    circle.origin(origin);
    refresh();
    return done;
  });
}

function animationState() {
  return 'animation: '+ (done ? 'off' : 'on');
}



d3.select("select").on("change", function() {
  stopAnimation();
  projection.mode(this.value).scale;
  refresh(750);
});

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
  g.origin([-71.03,42.37])
}
