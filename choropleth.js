var svg = d3.select("#svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var borderPath = svg.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", 600)
       			.attr("width", 960)
       			.style("stroke", "black")
       			.style("fill", "none")
       			.style("stroke-width", 2);

var clicked = 2;

var selected = "";

var max = 0;

var heatmap = d3.map();

var path = d3.geoPath();

var zoom = d3.zoom()
    .scaleExtent([1, 2.25])
    .on("zoom", zoomed);

var json = [];

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data.csv", function(d) { json.push({"geoid": d.geoid, "agency": d.agency, "state": d.state, "population": d.population}); if(d.population > max) { max = d.population; } heatmap.set(d.geoid, +d.population); })
    .await(ready);

var geoid_map = {};
var i = null;
for (i = 0; json.length > i; i += 1) {
    geoid_map[json[i].geoid] = json[i];
}
 
function get_geoid(geoid) {
    return geoid_map[geoid];
}

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
      .call(zoom)
	  /*.call(d3.zoom().on("zoom", function () {
    		svg.attr("transform", d3.event.transform)
 		}))*/
      .attr("class", "counties")
	  .attr("border", 1)
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { d.value = heatmap.get(d.id); if(d.value != null) { return color((d.value / max) * 10); } else { return "grey"; }})
	  .on("mouseover", function(d) { selected = d.id; })
	  //.on("mouseout", function(d) { if(d.value != null) { d3.select(this).attr("fill", color((d.value / max) * 10)); } else { d3.select(this).attr("fill", "grey"); }})
	  .on("click", function(d) { var obj = d3.select(this); clicked++;
			  if(obj.attr("fill") == "yellow") { 
			      obj.attr("fill", function (d) { 
					if(d.value != null) {
					  return color((d.value / max) * 10); 
					} 
					else { return "grey"; } 
				  }); }
			  else { d3.select(this).attr("fill", "yellow"); }})
      .attr("d", path)
    .append("title")
      .text(function(d) { var info; var data; 
	      for(var j = 0; j < json.length; j++) { 
		  if(json[j].geoid == d.id) {
			data = json[j];
			} 
	  	}
		if(d.value != null) {info = data.agency + ", " + data.state + "\nPopulation: " + data.population; return info; } 
	  	else { return "No data available."; } });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path)
	  .on("click", function() { alert("Border clicked. Please click on inside the state."); });
}

function zoomed() {
  svg.attr("transform", d3.event.transform);
}
