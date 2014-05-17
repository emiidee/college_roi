    // var data = [
//   {"School": "Harvey Mudd College ", "Cost": "229500", "ROI": "980900"},
//   {"School": "California Institute of Technology (Caltech) ", "Cost": "220400", "ROI": "837600"},
//   {"School": "Massachusetts Institute of Technology (MIT) ", "Cost": "223400", "ROI": "831100"},
//   {"School": "Stanford University ", "Cost": "236300", "ROI": "789500"},
//   {"School": "Colorado School of Mines (In-State)", "Cost": "114200", "ROI": "783400"},
//   {"School": "Georgia Institute of Technology (In-State)", "Cost": "92250", "ROI": "755600"}
// ];
var width = 1000;
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

d3.csv('/data_clean.csv', function(error, data) {
    // x.domain([0, d3.max(data, function(d){return d['20netroi'];})])
    x.domain([0, 1094000]);

    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d){ return x(d['20netroi_aid']);})
        .attr("height", barHeight - 1);

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