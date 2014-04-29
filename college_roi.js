var d = [
  {"School": "Harvey Mudd College ", "Cost": "229500", "ROI": "980900"},
  {"School": "California Institute of Technology (Caltech) ", "Cost": "220400", "ROI": "837600"},
  {"School": "Massachusetts Institute of Technology (MIT) ", "Cost": "223400", "ROI": "831100"},
  {"School": "Stanford University ", "Cost": "236300", "ROI": "789500"},
  {"School": "Colorado School of Mines (In-State)", "Cost": "114200", "ROI": "783400"},
  {"School": "Georgia Institute of Technology (In-State)", "Cost": "92250", "ROI": "755600"}
];

d3.select(".chart")
  .selectAll("div")
    .data(d)
  .enter().append("div")
    .attr('class', 'bar')
    .style("width", function(d) { return d.Cost / 300 + "px"; })
    .style("height", '10px')
    .text(function(d) { return d.School; });
  
