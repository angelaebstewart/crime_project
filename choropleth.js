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
var acc = 0;

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data2.csv", function(d) {
                  if(d.geoid < 10000) { d.geoid = "0" + d.geoid; }
		  json.push({"geoid": d.geoid, "county": d.county, "state": d.state, "population": d.population, "male": d.male, "female": d.female, "other": d.other, "asian": d.asian, "black": d.black, "hawaiian": d.hawaiian, "native": d.aboriginal, "multiple": d.multiple, "violent": d.violent, "property": d.property, "active": d.population});
		  if(parseInt(d.population) > max) { max = parseInt(d.population); } if(parseInt(d.population) < min) { min = parseInt(d.population); } heatmap.set(d.geoid, +acc);
                  acc++;
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
    .attr("id", "caption")
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

function update_caption() {
    var cap = document.getElementById("caption");
    cap.innerHTML = "Updated.";
    return 0;
}

var checked = 0;
function update_map() {
   checked++;
   max = 0;
   min = 999999999;
   heatmap.clear();
   acc = 0;
   json = [];
   d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data2.csv", function(d) {
                  if(d.geoid < 10000) { d.geoid = "0" + d.geoid; }
		  json.push({"geoid": d.geoid, "county": d.county, "state": d.state, "population": d.population, "male": d.male, "female": d.female, "other": d.other, "asian": d.asian, "black": d.black, "hawaiian": d.hawaiian, "native": d.aboriginal, "multiple": d.multiple, "violent": d.violent, "property": d.property, "active": d.violent});
		  if(parseInt(d.violent) > max) { max = parseInt(d.violent); } if(parseInt(d.violent) < min) { min = parseInt(d.violent); } heatmap.set(d.geoid, +acc);
                  acc++;
		})
    .await(ready);
    return 0;
}

//update_map();
function ready(error, us) {
  if (error) throw error;
  
  update_caption();
  svg.append("g")
      .attr("id", "map_counties")
      .call(zoom).on("wheel.zoom", null)
      .attr("class", "counties")
	  .attr("border", 1)
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { var v = heatmap.get(d.id); 
          if(json[v] != null) { d.value = json[v].active; d.properties = json[v]; } 
          if(d.value != null && d.value != -1) { return color(((d.value * 1.0) / (max * 1.0)) * 90); } else { return "grey"; }})
	  //.on("mouseover", function(d) { selected = d.id; })
	  .on("click", function(d) { var obj = d3.select(this);
	    if(obj.attr("fill") == "yellow") {
                obj.attr("id", "");
	        obj.attr("fill", function (d) { 
		if(d.value != null && d.value != -1) {
		  return color(((d.value * 1.0) / (max * 1.0)) * 90); 
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
      .text(function(d) { var info = ""; var data = json[heatmap.get(d.id)];
		if(d.value != null && d.value != -1) {info = data.county + ", " + data.state + "\nPopulation: " + data.population + "\nActive: " + data.active; return info; } 
	  	else {
                    if(data != null && data.county != null && data.state != null) {
                        info = data.county + ", " + data.state + "\n";
                    }
                    info = info + "No data available."; return info;
                }
            });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("id", "map_states")
      .attr("d", path);
	  //.on("click", function() { alert("Border clicked. Please click on inside the state."); });
    if(checked == 0) { update_map(); }
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
