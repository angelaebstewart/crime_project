function barChart() {


    var margin = {top:10, right:10, bottom:90, left:100};
    var width = 800 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var barPadding = 5;
    var fillColor = d3.rgb(68, 143, 163);
    var data = [];

    var updateWidth;
    var updateHeight;
    var updateFillColor;
    var updateData;
    
    

    function chart(selection){
        selection.each(function () {
            
            var dataVals = [];
            var labelVals = [];

            data.forEach(function(chartValue, index) {  dataVals.push(chartValue.value); labelVals.push(chartValue.label); });

            var barSpacing = width / data.length;
            var barWidth = barSpacing - barPadding;
            var maxValue = d3.max(dataVals);
            var heightScale = height / (maxValue);
            var numValues = data.length;
            var addXLabels = false;

            if (numValues < 11) {
                addXLabels = true;
            }

            var dom = d3.select(this);
            var svg = dom.append('svg')
                .attr('class', 'bar-chart')
                .attr('height', height + margin.top + margin.bottom)
                .attr('width', width + margin.left + margin.right)
                .style('fill', fillColor);

            var xScale = d3.scaleOrdinal()
                .range([0, width]);

            var yScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([height, 0]);
            
            var xAxis = d3.axisBottom()
                .scale(xScale);

            var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
            


            /*svg.append("text")
                .attr("class", "title")
                .attr("x", ((width + margin.left + margin.right) / 2))             
                .attr("y", 30)
                .attr("text-anchor", "middle")  
                .style("font", "26px sans-serif")  
                .text("Demographics Bar Chart");*/

            var bars = svg.selectAll('rect.display-bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'display-bar')
                .attr("id", function(d,i) {
                    if( typeof d.geoid !== 'undefined' ) {
                        console.log(d.geoid);
                        return 'bar_' + d.geoid;} else {
                            return 'bar_' + i;
                        }
                    })
                .attr('y', function (d) { return height - (d.value * heightScale);}) //WAS 0
                .attr('width', barWidth)
                .attr('x', function(d, i) {return (i * barSpacing) + margin.left + barPadding;})
                .attr('height', function (d) { return d.value * heightScale; })
                .on("mouseover", function(d) {d3.select(this).attr("fill", d3.rgb(0, 62, 31)); var coordinates = d3.mouse(this); focus.select("text").attr("x", coordinates[0]).attr("dy", coordinates[1] - 5).text(d.value); focus.style("display", null);})
                .on("mouseout", function() {d3.select(this).attr("fill",  d3.rgb(68, 143, 163)); focus.style("display", "none");});
           
            var focus = svg.append("g")
                .attr("class", "focus")
                .style("fill", "black")
                .style("display", "none");
                
            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "middle");

            var barText = svg.selectAll('g')
                .data(data)
                .enter();

            if (addXLabels) {
                barText
                    .append("text")
                    .attr("class", "bar-label")
                    .attr("fill", "black")
                    .attr("x", function(d, i) { return margin.left + ((i * barPadding) + (i * barWidth) + (barWidth / 2))})
                    .attr("y", height + 10)
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em") //vertical align middle
                    .text(function(d){ return d.label; });
            }  
            



                //.attr("opacity", .2);
                //.on("mouseover", function(d) {d3.select(this).attr("fill", "red"); var coordinates = [0, 0]; coordinates = d3.mouse(this); var x = coordinates[0]; var y = coordinates[1]; focus.select("text").attr("x", x).attr("dy", y - 5).text("X: " + x.toString() + ", Y: " + y.toString()); focus.style("display", null);})
                //.on("mouseout", function() {d3.select(this).attr("fill", "coral"); focus.style("display", "none");});


            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", -height/2 )
                .attr("y", -50)
                .attr("transform", "rotate(-90)")       
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .attr("fill", "black")
                .style("font", "24px sans-serif")
                .text("Percent");

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + margin.left + "," + (height) + ")")
                .call(xAxis);
                /*.append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .attr("fill", "black")
                .style("font", "24px sans-serif")
                .text("Demographics"); */  


            updateHeight = function() {
                heightScale = height / (maxValue);
                bars.transition().duration(1000).attr('height', function(d) { return d.value * heightScale; });
                svg.transition().duration(1000).attr('height', height);
            };

            updateWidth = function() {
                barSpacing = width / data.length;
                barWidth = barSpacing - barPadding;
                bars.transition().duration(1000).attr('x', function(d, i) {return (i * barSpacing) + margin.left + barPadding;})
                    .attr('width', barWidth);
                barText.transition().duration(1000).attr("x", function(d, i) { return margin.left + ((i * barPadding) + (i * barWidth) + (barWidth / 2))});

                svg.transition().duration(1000).attr('width', width);

            };

            updateFillColor = function() {
                svg.transition().duration(1000).style('fill', fillColor);
            };

            updateData = function() {
                //alert(data[0].label);
                barSpacing = width / data.length;
                barWidth = barSpacing - barPadding;

                dataVals = [];
                labelVals = [];
                data.forEach(function(chartValue, index) {  dataVals.push(chartValue.value); labelVals.push(chartValue.label); });
                maxValue = d3.max(dataVals);
                heightScale = height / (maxValue);
                numValues = data.length;

                if (numValues < 11) {
                    addXLabels = true;
                } else {
                    addXLabels = false;
                }


                yScale.domain([0, maxValue]);
                svg.select(".y-axis").transition().duration(1000).call(yAxis);

                var update = svg.selectAll('rect.display-bar')
                    .data(data);
                    //.on("mouseover", function(d) {d3.select(this).attr("fill", "red"); var coordinates = [0, 0]; coordinates = d3.mouse(this); var x = coordinates[0]; var y = coordinates[1]; focus.select("text").attr("x", x).attr("dy", y - 5).text("X: " + x.toString() + ", Y: " + y.toString()); focus.style("display", null);})
                    //.on("mouseout", function() {d3.select(this).attr("fill", "coral"); focus.style("display", "none");});

                var updateBarText = svg.selectAll('.bar-label')
                    .data(data);


                if (addXLabels) {
                    updateBarText
                        .transition()
                        .duration(1000)
                        .attr('x', function(d, i) { return margin.left + ((i * barPadding) + (i * barWidth) + (barWidth / 2))})
                        .text(function(d){ return d.label; });
                } else {
                    updateBarText
                        .transition()
                        .duration(650)
                        .delay(function(d, i) { return (data.length - i) ; })
                        .style('opacity', 0)
                        .attr('x', 0)
                        .remove();
                }

                update
                    .transition()
                    .duration(1000)
                    .attr('x', function(d, i) {return (i * barSpacing) + margin.left + barPadding;})
                    .attr('width', barWidth)
                    .attr('y', function(d) { return height - (d.value * heightScale);}) //WAS 0
                    .attr('height', function(d) { return d.value * heightScale; });

                update.enter()
                    .append('rect')
                    .attr('class', 'display-bar')
                    .attr("id", function(d,i) {
                        if( typeof d.geoid !== 'undefined' ) {
                            return d.geoid;} else {
                                return 'bar_' + i;
                            }
                        })
                    .attr('x', function(d, i) {return (i * barSpacing) + margin.left + barPadding;})
                    .attr('width', barWidth)
                    .attr('y', function(d) { return height - (d.value * heightScale);})
                    .attr('height', 0)
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .delay(function(d, i) { return (data.length - i) * 40; })
                    .attr('height', function(d) { return d.value * heightScale; })
                    .style('opacity', 1);

                if (addXLabels) {
                    updateBarText.enter()
                        .append("text")
                        .attr("class", "bar-label")
                        .attr("fill", "black")
                        .attr("x", function(d, i) { return margin.left + ((i * barPadding) + (i * barWidth) + (barWidth / 2))})
                        .attr("y", height + 10)
                        .attr("text-anchor", "middle")
                        .attr("dy", ".35em") //vertical align middle
                        .style('opacity', 0)
                        .transition()
                        .duration(1000)
                        .delay(function(d, i) { return (data.length - i) * 40; })
                        .text(function(d){ return d.label; })
                        .style('opacity', 1);
                }
                
                update.exit()
                    .transition()
                    .duration(650)
                    .delay(function(d, i) { return (data.length - i) * 20; })
                    .style('opacity', 0)
                    .attr('height', 0)
                    .attr('x', 0)
                    .attr('width', 0)
                    .remove();

                updateBarText.exit()
                    .transition()
                    .duration(650)
                    .delay(function(d, i) { return (data.length - i) * 20; })
                    .style('opacity', 0)
                    .attr('x', 0)
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

    chart.highlightBar = function(barID) {
        var selectedBar = d3.select("#" + barID);
        selectedBar.transition().duration(1000).style('fill', d3.rgb(186, 45, 11));
    };

    return chart;
}