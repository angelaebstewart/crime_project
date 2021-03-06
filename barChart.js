var charts_charted = 0;

function barChart() {


    var margin = {top:10, right:10, bottom:90, left:100};
    var width = 800 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var barPadding = 2;
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
				.attr('id', function() { charts_charted++; })
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
            


            var bars = svg.selectAll('rect.display-bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'display-bar')
                .attr("id", function(d,i) {
                    if( typeof d.geoid !== 'undefined' ) {
                        //console.log(d.geoid);
                        return 'bar_' + d.geoid;} else {
                            return 'bar_' + i;
                        }
                    })
                .attr('y', function (d) { return height - (d.value * heightScale);}) //WAS 0
                .attr('width', barWidth)
                .attr('x', function(d, i) {return (i * barSpacing) + margin.left + barPadding;})
                .attr('height', function (d) { return d.value * heightScale; })
                .on("mouseover", function(d) {d3.select(this).attr("fill", d3.rgb(0, 62, 31))})
                .on("mouseout", function(d) {d3.select(this).attr("fill", d3.rgb(68, 143, 163))})
				.append('title')
                .attr('class', 'tooltip')
                .text(function (d) {
					if(d.value < 10) {
						return d.label + "\n" + (Number(d.value) * 100).toFixed(2) + "%";
					}
					else {
						return d.label + "\n$" + d.value;
					}
					});
           

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
            


            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", -height/2 )
                .attr("y", -75)
                .attr("transform", "rotate(-90)")       
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .attr("fill", "black")
                .style("font", "24px sans-serif")
                .text(function() { if(charts_charted % 2 == 0) { return "US Dollars"; } else { return "Percent"; } });

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(" + margin.left + "," + (height) + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width/2 )
                .attr("y", -height)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .attr("fill", "black")
                .style("font", "24px sans-serif")
                .text(function() { if(charts_charted % 2 == 0) { return "Median Incomes"; } else { return null; } });


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

                var updateBarText = svg.selectAll('.bar-label')
                    .data(data);

                var updateToolTips = svg.selectAll('title.tooltip')
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
                    .attr('height', function(d) { return d.value * heightScale; })
                    .attr("id", function(d,i) {
                        if( typeof d.geoid !== 'undefined' ) {
                            //console.log(d.geoid);
                            return 'bar_' + d.geoid;} else {
                                return 'bar_' + i;
                            }
                        })
                    .style("fill", d3.rgb(68, 143, 163));

                updateToolTips.text(function (d) {
                    if(d.value < 10) {
                        return d.label + "\n" + (Number(d.value) * 100).toFixed(2) + "%";
                    }
                    else {
                        return d.label + "\n$" + d.value;
                    }
                    });

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
                    .on("mouseover", function(d) {d3.select(this).attr("fill", d3.rgb(0, 62, 31))})
                    .on("mouseout", function(d) {d3.select(this).attr("fill", d3.rgb(68, 143, 163))})
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .delay(function(d, i) { return (data.length - i) * 40; })
                    .attr('height', function(d) { return d.value * heightScale; })
                    .style('opacity', 1);

                updateToolTips.enter().append('title')
                    .attr('class', 'tooltip')
                    .text(function (d) {
                    if(d.value < 10) {
                        return d.label + "\n" + (Number(d.value) * 100).toFixed(2) + "%";
                    }
                    else {
                        return d.label + "\n$" + d.value;
                    }
                    });


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

                updateToolTips.exit().remove();
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
        //console.log("#" + barID);
        var selectedBar = d3.selectAll("#" + barID);
        console.log(selectedBar.empty());
        setTimeout(function() {
            selectedBar = d3.selectAll("#" + barID);
            selectedBar.transition().duration(1000).style("fill", d3.rgb(186, 45, 11));
        }, 5000);

        return chart;
    };

    /*chart.xTitle = function(xText) {
        svg.selectAll(".x-axis")
                .append("text")
                .attr("class", "label")
                .attr("x", width/2 )
                .attr("y", height)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .attr("fill", "black")
                .style("font", "24px sans-serif")
                .text(xText);
        return chart;
    };*/

    return chart;
}
