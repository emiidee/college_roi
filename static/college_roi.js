// Declare variables
var width = 1000;
  barHeight = 10;

// Function to convert CSV data into JS object
function type(d) {
  return {
    school: d.School,
    gradRate: parseFloat(d['Grad Rate']),
    withoutAid: {
      cost: parseInt(d['2013cost']),
      netROI: majorData(parseInt, d, '_20netroi'),
      annualROI: majorData(parseFloat, d, '_annualroi')
    },
    withAid: {
      cost: parseInt(d['2013cost_aid']),
      netROI: majorData(parseInt, d, '_20netroi_aid'),
      annualROI: majorData(parseFloat, d, '_annualroi_aid')
    },
  };
}

// Helper function for data conversion
function majorData(typeFunc, data, suffix) {
  var result = {};

  for (var key in data) {
    if(data.hasOwnProperty(key)) {
      if(key.slice(-suffix.length) === suffix) { // if suffix of key is suffix
        if (data[key] !== '') {
          var major = key.slice(0, key.length - suffix.length);
          result[major] = typeFunc(data[key]);
        }
      }
    }
  }

  return result;
}

d3.csv('/data.csv', type, function(error, data) {
  console.log(data);
  // todo: fix the max of x to match the current variable, keep in mind min
  // of negative values
  // Scale data range to fit in SVG object
  var x = d3.scale.linear()
      .domain(d3.extent(data, function(d){return +d['20netroi_aid'];}))
      .range([0, width]);
      // .domain([0, d3.max(data, function(d){return +d['20netroi_aid'];})]);

  console.log(d3.extent(data, function(d){return +d['20netroi_aid'];}));

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
    .attr("x", function(d) { return x(Math.min(0, d['20netroi_aid'])); })
    .attr("width", 0)
    .attr("height", barHeight - 1) // with gap
  .transition().duration(800)
    .ease(d3.ease('bounce'))
    .attr("width", function(d){ return Math.abs(x(d['20netroi_aid']) - x(0));});

  // Label bars
  bar.append("text")
    .attr("x", function(d) { return x(d['20netroi_aid']) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.School; });
  
});



// Brainstorm

// BASIC REQUIREMENTS
// Add negative values
// Use nests to categorize data
// On hover of a bar...
    // Add fish eye on hover
    // Display attributes of that School
// Sort (auto or sort button?)


// EXTRA CREDIT
// Drop down to select all or major data
// Toggle 20 year net roi or annual roi
// Toggle for seeing values with or without aid
// Drop down for sort by category
// Display cost as a stack
// On click of a bar...
    // Open up school website on a new page (or Collegeboard website?)

// NIGHTMARE MODE!
// Incorporate crossfilter to show portions of data at a time (http://square.github.io/crossfilter/)


// Todo
// Clean data 
// Push live
// Add readme













