var svg = d3.select("#svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var centered;

var max = 0;

var heatmap = d3.map();

var path = d3.geoPath();

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data.csv", function(d) { if(d.population > max) { max = d.population; } heatmap.set(d.geoid, +d.population); })
    .await(ready);

var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

var color = d3.scaleThreshold()
    .domain(d3.range(1, 10))
    .range(d3.schemeGreens[9]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)"); 

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Urban/Rural Counties");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();

function ready(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { d.value = heatmap.get(d.id); if(d.value != null) { return color((d.value / max) * 10); } else { return "grey"; }})
	  .on("mouseover", function() { d3.select(this).attr("fill", "yellow"); })
	  .on("mouseout", function(d) { if(d.value != null) { d3.select(this).attr("fill", color((d.value / max) * 10)); } else { d3.select(this).attr("fill", "grey"); }})
      //.on("click", clicked)
      .attr("d", path)
	//.on("click", function(d) { document.getElementById("svg").style.visibility = "hidden";
	//							 var map = document.getElementById("map");
	//							 map.innerHTML = "<br/><img src='indiana.png'></img>"; })
    .append("title")
      .text(function(d) { if(d.value != null) { return d.value; } else { return "No data available."; } });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path)
	  .on("click", function() { alert("Border clicked. Please click on inside the state."); });
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
