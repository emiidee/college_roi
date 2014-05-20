// Declare variables
var
  // Chart settings
  width = 960;
  height = 500;
  // Data toggles
  major = 'all';
  aid = 'withoutAid';
  roi = 'annualROI';

// Set size of the SVG object with class .chart
var chart = d3.select(".chart")
  .attr("width", width)
  .attr("height", height);

// Import data
d3.csv('/data.csv', type, function(error, data) {
  console.log(data); // #REMOVE
  // var value = d[aid][roi][major];

  // Scale data range to fit in SVG object
  var y = d3.scale.linear()
    .domain(d3.extent(data, function(d){return d[aid][roi][major];}))
    .range([height, 0]);

  // Put bars on the page
  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });
  bar.append("rect")
    .attr("y", function(d) { return y(0); })
    .attr("width", barWidth)
    .attr("height", 0) // should start at height 0
  .transition().duration(2000)
    .ease(d3.ease('linear'))
    .attr("y", function(d) { return y(Math.max(0, d[aid][roi][major])); })
    .attr("height", function(d){ return Math.abs(y(d[aid][roi][major]) - y(0));});

  // Label bars
  // bar.append("text")
  //   .attr("y", function(d, i) { return y(d[aid][roi][major]) - 3; })
  //   .attr("x", barWidth * i)
  //   .attr("dx", ".35em")
  //   .attr("rotate", -20)
  //   .text(function(d) { return d.school; });
  
});


//***************************************************************
// Helper Functions
//***************************************************************

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



//***************************************************************
// Brainstorm
//***************************************************************

/*
BASIC REQUIREMENTS
[x] Convert to vertical bars
[ ] On hover of a bar...
[ ]   Add fish eye on hover
[ ]   Display attributes of that School
[ ] Sort (auto or sort button?)
[ ] Display cost as a stack

EXTRA CREDIT
[ ] Use nests to categorize data
[ ] Drop down to select all or major data
[ ] Toggle 20 year net roi or annual roi
[ ] Toggle for seeing values with or without aid
[ ] Drop down for sort by category
[ ] On click of a bar...
[ ]   Open up school website on a new page (or Collegeboard website?)

NIGHTMARE MODE!
[ ] Incorporate crossfilter to show portions of data at a time (http://square.github.io/crossfilter/)

CLEAN UP TIME
[ ] Clean data 
[ ] Push live
[ ] Add readme
*/