$(function() { $( "#draggable1" ).draggable({ containment: "window" }); });

$(function() { $( "#draggable2" ).draggable({ containment: "window" }); });


$( "#hider" ).click(function() {
  $( "#draggable1" ).hide( "drop", { direction: "down" }, "slow" );
  $( "#draggable2" ).hide( "drop", { direction: "down" }, "slow" );
  });
 
$( "#shower" ).click(function() {
  $( "#draggable1" ).show( "slide", { direction: "down" }, "slow" );
  $( "#draggable2" ).show( "slide", { direction: "down" }, "slow" );
});



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
