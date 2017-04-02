function barChart() {


    // All options that should be accessible to caller
    var width = 500;
    var height = 300;
    var barPadding = 1;
    var fillColor = 'coral';
    var data = [];

    var updateWidth;
    var updateHeight;
    var updateFillColor;
    var updateData;
    
    

    function chart(selection){
        selection.each(function () {
			

            var barSpacing = width / data.length;
            var barWidth = barSpacing - barPadding;
            var maxValue = d3.max(data);
            var heightScale = height / (maxValue + 10);



            var dom = d3.select(this);
            var svg = dom.append('svg')
                .attr('class', 'bar-chart')
                .attr('height', height)
                .attr('width', width)
                .style('fill', fillColor);

			var xScale = d3.scaleLinear()
				.domain([0, data.length])
                .range([0, width]);

			var yScale = d3.scaleLinear()
				.domain([0, maxValue])
                .range([0, height]);
			
			var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(0);

			var yAxis = d3.axisRight()
				.scale(yScale)
				.ticks(0);
			

			
			
			var focus = svg.append("g")
				.attr("class", "focus")
				.style("fill", "black")
				.style("display", "none");
				
			focus.append("text")
				.attr("x", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "middle");

            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 30)
                .attr("text-anchor", "middle")  
                .style("font", "26px sans-serif")  
                .text("Demographics Bar Chart");

            var bars = svg.selectAll('rect.display-bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'display-bar')
                .attr('y', function (d) {return height - (d * heightScale);}) //WAS 0
                .attr('width', barWidth)
                .attr('x', function(d, i) {return i * barSpacing;})
                .attr('height', function (d) { return d * heightScale; })
				.attr("opacity", .2);
                //.on("mouseover", function(d) {d3.select(this).attr("fill", "red"); var coordinates = [0, 0]; coordinates = d3.mouse(this); var x = coordinates[0]; var y = coordinates[1]; focus.select("text").attr("x", x).attr("dy", y - 5).text("X: " + x.toString() + ", Y: " + y.toString()); focus.style("display", null);})
                //.on("mouseout", function() {d3.select(this).attr("fill", "coral"); focus.style("display", "none");});


			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(1,0)")
				.call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font", "24px sans-serif")
                .text("Percent");

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (height - 5) + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .style("font", "24px sans-serif")
                .text("Demographics");                
            //bars.append("svg:title").text(function(d) { return d.x; });    
            //bars.append("svg:title").text("text here");


            // update functions
            updateHeight = function() {
                heightScale = height / (maxValue + 100);
                bars.transition().duration(1000).attr('height', function(d) { return d * heightScale; });
                svg.transition().duration(1000).attr('height', height);
            };

            updateWidth = function() {
                barSpacing = width / data.length;
                barWidth = barSpacing - barPadding;
                bars.transition().duration(1000).attr('x', function(d, i) { return i * barSpacing; })
                    .attr('width', barWidth);
                svg.transition().duration(1000).attr('width', width);

            };

            updateFillColor = function() {
                svg.transition().duration(1000).style('fill', fillColor);
            };

            updateData = function() {
                barSpacing = width / data.length;
                barWidth = barSpacing - barPadding;
                maxValue = d3.max(data);
                heightScale = height / (maxValue + 10);

                //yScale = d3.scaleLinear()
                //    .domain([0, maxValue])
                //    .range([0, height]);

                //svg.select('y-axis')
                //    .scale(yScale);

                var update = svg.selectAll('rect.display-bar')
                    .data(data);
					//.on("mouseover", function(d) {d3.select(this).attr("fill", "red"); var coordinates = [0, 0]; coordinates = d3.mouse(this); var x = coordinates[0]; var y = coordinates[1]; focus.select("text").attr("x", x).attr("dy", y - 5).text("X: " + x.toString() + ", Y: " + y.toString()); focus.style("display", null);})
					//.on("mouseout", function() {d3.select(this).attr("fill", "coral"); focus.style("display", "none");});

                update
                    .transition()
                    .duration(1000)
                    .attr('x', function(d, i) { return i * barSpacing; })
                    .attr('width', barWidth)
                    .attr('y', function(d) {return height - (d * heightScale);}) //WAS 0
                    .attr('height', function(d) { return d * heightScale; });

                update.enter()
                    .append('rect')
                    .attr('class', 'display-bar')
                    .attr('x', function(d, i) { return i * barSpacing; })
                    .attr('width', barWidth)
                    .attr('y', function(d) {return height - (d * heightScale);})
                    .attr('height', 0)
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .delay(function(d, i) { return (data.length - i) * 40; })
                    .attr('height', function(d) { return d * heightScale; })
                    .style('opacity', .2);

                update.exit()
                    .transition()
                    .duration(650)
                    .delay(function(d, i) { return (data.length - i) * 20; })
                    .style('opacity', 0)
                    .attr('height', 0)
                    .attr('x', 0)
                    .attr('width', 0)
                    .remove();
				

            }

        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
    };

    chart.fillColor = function(value) {
        if (!arguments.length) return fillColor;
        fillColor = value;
        if (typeof updateFillColor === 'function') updateFillColor();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    return chart;
}
