var data = [
  {"School": "Harvey Mudd College ", "Cost": "229500", "ROI": "980900"},
  {"School": "California Institute of Technology (Caltech) ", "Cost": "220400", "ROI": "837600"},
  {"School": "Massachusetts Institute of Technology (MIT) ", "Cost": "223400", "ROI": "831100"},
  {"School": "Stanford University ", "Cost": "236300", "ROI": "789500"},
  {"School": "Colorado School of Mines (In-State)", "Cost": "114200", "ROI": "783400"},
  {"School": "Georgia Institute of Technology (In-State)", "Cost": "92250", "ROI": "755600"}
];

var width = 420;
    barHeight = 20;

var x = d3.scale.linear()
    .domain([0, d3.max(data.ROI)])
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d.ROI) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
