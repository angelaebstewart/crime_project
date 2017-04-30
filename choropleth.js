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
                  if(d.violent != null && d.violent != "-1" && d.property != null && d.property != "-1") { d.overall = Number(d.violent) + Number(d.property); } else { d.overall = -1; }
		  json.push({"geoid": d.geoid, "county": d.county, "state": d.state, "population": d.population, "male": d.male, "female": d.female, "other": d.other, "asian": d.asian, "black": d.black, "hawaiian": d.hawaiian, "aboriginal": d.aboriginal, "multiple": d.multiple, "white": d.white, "violent": d.violent, "property": d.property, "murder": d.murder, "rape": d.rape, "robbery": d.robbery, "assault": d.assault, "burglary": d.burglary, "larceny": d.larceny, "motor": d.vehicle, "overall": d.overall, "active": d.population});
		  if(parseInt(d.population) > max) { max = parseInt(d.population); } if(parseInt(d.population) < min && parseInt(d.population) != -1) { min = parseInt(d.population); } heatmap.set(d.geoid, +acc);
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
    .tickFormat(function(x, i) { return i ? x: x; })
    //.tickValues(color.domain()))
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  .select(".domain")
    .remove();

var active_data = "Population";

function get_active(d, opt) {
    var active;
    active_data = opt;
    switch(opt) {
        case "Murder & Nonnegligent Manslaughter":
            active = d.murder;
            break;
        case "Rape":
            active = d.rape;
            break;
        case "Robbery":
            active = d.robbery;
            break;
        case "Aggravated Assault":
            active = d.assault;
            break;
        case "Burglary":
            active = d.burglary;
            break;
        case "Larceny-Theft":
            active = d.larceny;
            break;
        case "Motor Vehicle Theft":
            active = d.vehicle;
            break;
        case "Violent Crime":
            active = d.violent;
            break;
        case "Property Crime":
            active = d.property;
            break;
        case "Overall Crime":
            active = d.overall;
            break;
        default:
            active = d.population;
            break;

    }
    return active;
}

function update_caption(opt) {
    var cap = document.getElementById("caption");
    cap.innerHTML = active_data + " of US Counties";
    return 0;
}

function update_map(opt) {
   max = 0;
   min = 999999999;
   heatmap.clear();
   acc = 0;
   json = [];
   d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.csv, "data2.csv", function(d) {
                  if(d.geoid < 10000) { d.geoid = "0" + d.geoid; }
                  if(d.violent != null && d.violent != "-1" && d.property != null && d.property != "-1") { d.overall = Number(d.violent) + Number(d.property); } else { d.overall = -1; }
                  d.active = get_active(d, opt);
                  update_caption(opt);
		  json.push({"geoid": d.geoid, "county": d.county, "state": d.state, "population": d.population, "male": d.male, "female": d.female, "other": d.other, "asian": d.asian, "black": d.black, "hawaiian": d.hawaiian, "aboriginal": d.aboriginal, "multiple": d.multiple, "white": d.white, "violent": d.violent, "property": d.property, "overall": d.overall, "murder": d.murder, "rape": d.rape, "robbery": d.robbery, "assault": d.assault, "burglary": d.burglary, "larceny": d.larceny, "motor": d.vehicle, "active": d.active});
		  if(Number(d.active) > max) { max = Number(d.active); } if(Number(d.active) < min && Number(d.active) != -1) { min = Number(d.active); } heatmap.set(d.geoid, +acc);
                  acc++;
		})
    .await(ready);
    //update_ticks();
    return 0;
}

function update_ticks() {
    var ticks = document.getElementsByClassName("tick");
    for(var t = 0; t < ticks.length; t++) {
        if(t == 0) { ticks[t].innerHTML = "<line stroke=\"#000\" y2=\"13\" x1=\"0.5\" x2=\"0.5\"></line><text fill=\"#000\" y=\"16\" x=\"0.5\" dx=\"1.5em\" dy=\"1em\" transform=\"rotate(30)\">" + min + "</text>"; }
        else { ticks[t].innerHTML = "<line stroke=\"#000\" y2=\"13\" x1=\"0.5\" x2=\"0.5\"></line><text fill=\"#000\" y=\"16\" x=\"0.5\" dx=\"1.5em\" dy=\"1em\" transform=\"rotate(30)\">" + Math.ceil(max * ((t + 1.0) / 9.0)) + "</text>"; }
    }
    return 0;
}


function ready(error, us) {
  if (error) throw error;

  update_ticks();
  svg.append("g")
      .attr("id", "map_counties")
      .call(zoom).on("wheel.zoom", null)
      .attr("class", "counties")
	  .attr("border", 1)
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { var v = heatmap.get(d.id); 
          if(json[v] != null) { d.value = Number(json[v].active); d.properties = json[v]; } 
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
                obj.attr("id", "selected"); selected = d3.select(this).attr("fill"); d3.select(this).attr("fill", "yellow"); 
                county_highlight(d.id);
            }})
	  .on("dblclick", function(d) { clicked++;
              if(clicked % 3 != 0) {
                  var data = json[heatmap.get(d.id)];
                  context_change(data.state);
              }
              //var state;
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
		if(d.value != null && d.value != -1) {info = data.county + ", " + data.state + "\n\nPopulation: " + data.population;
                    if(data.active != data.population) { info = info + "\n" + active_data + ": " + (Number(data.active)).toFixed(2) + " per capita"; }
                    info = info + "\n\nMale: " + (Number(data.male) * 100).toFixed(2) + "%\nFemale: " + (Number(data.female) * 100).toFixed(2) + "%\n\nAsian: " + (Number(data.asian) * 100).toFixed(2) + "%\nBlack: " + (Number(data.black) * 100).toFixed(2) + "%\nHawaiian or Pacific Islander: " + (Number(data.hawaiian) * 100).toFixed(2) + "%\nNative American: " + (Number(data.aboriginal) * 100).toFixed(2) + "%\nWhite: " + (Number(data.white) * 100).toFixed(2) + "%\nMultiracial: " + (Number(data.multiple) * 100).toFixed(2) + "%\nOther: " + (Number(data.other) * 100).toFixed(2) + "%"; 
                    return info;
                }
	  	else {
                    if(data != null && data.county != null && data.state != null) {
                        info = data.county + ", " + data.state + "\n";
                    }
                    if(data != null && data.active != null) {
                        info = info + "No crime data available."; return info;
                    }
                    info = info + "No data available."; return info;
                }
            });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("id", "map_states")
      .attr("d", path);
}

function context_change(state_selected) {

    return 0;
}

function county_highlight(geoid) {

    return 0;
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
