var svg = d3.select("#svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var clicked = 0;

var selected = "";

var max = 0;

var min = 999999999;

var heatmap = d3.map();

var path = d3.geoPath();

var zoom = d3.zoom()
	.duration(750)
    .scaleExtent([1, 3])
    .on("zoom", zoomed);

var json = [];

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data.csv", function(d) { 
		  json.push({"geoid": d.geoid, "agency": d.agency, "state": d.state, "population": d.population}); 
		  if(d.population > max) { max = d.population; } if(d.population < min) { min = d.population; } heatmap.set(d.geoid, +d.population); 
		})
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
    .text("Population of US Counties");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return x; })
    //.tickValues(color.domain()))
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  .select(".domain")
    .remove();

function ready(error, us) {
  if (error) throw error;

  svg.append("g")
      .call(zoom).on("wheel.zoom", null)
      .attr("class", "counties")
	  .attr("border", 1)
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { d.value = heatmap.get(d.id); if(d.value != null) { return color((d.value / max) * 10); } else { return "grey"; }})
	  //.on("mouseover", function(d) { selected = d.id; })
	  .on("click", function(d) { var obj = d3.select(this);
	    if(obj.attr("fill") == "yellow") {
                obj.attr("id", "");
	        obj.attr("fill", function (d) { 
		if(d.value != null) {
		  return color((d.value / max) * 10); 
		} 
		else { return "grey"; } 
		}); }
	    else { 
                var curr = document.getElementById("selected"); 
                if(curr != null) { curr.setAttribute("fill", selected); curr.setAttribute("id", ""); }
                obj.attr("id", "selected"); selected = d3.select(this).attr("fill"); d3.select(this).attr("fill", "yellow"); }})
	  .on("dblclick", function() { clicked++; //var state;
		/*for(var j = 0; j < json.length; j++) { 
		  if(json[j].geoid == d.id) {
			state = json[j].state;
			}
		}
		for(var j = 0; j < json.length; j++) { 
		  if(json[j].state == state) {
			d3.select("#" + json[j].geoid).attr("border", 2);
			}
		}*/
	  })
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
  if(clicked % 3 == 0) {
  	svg.attr("transform", "");

  }
  else {
  	svg.attr("transform", d3.event.transform);
  }
}
// vim: tabstop=8 shiftwidth=4 softtabstop=4 expandtab shiftround autoindent
