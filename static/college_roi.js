// Declare variables
var width = 1000;
    barHeight = 20;

d3.csv('/data_clean.csv', function(error, data) {
    // todo: fix the max of x to match the current variable, keep in mind min
    // of negative values
    // Scale data range to fit in SVG object
    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function(d){return +d['20netroi'];})]);

    // Set size of the SVG object with class .chart
    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", barHeight * data.length);

    // Put bars on the page
    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    // Size the height of the bars based on a data attribute
    bar.append("rect")
        .attr("width", function(d){ return x(d['20netroi_aid']);})
        .attr("height", barHeight - 1);

    // Label bars
    bar.append("text")
        .attr("x", function(d) { return x(d['20netroi_aid']) - 3; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.School; });
    
});

// function type(d) {
//   d.20netroi = +d.20netroi; // coerce to number
//   return d;
// }