// Data toggles variables
var major = 'All';
var aid = 'withoutAid';
var roi = 'netROI';
var schools = [];
var cost = [];
var colData = [];

$(function () {
  // Load data using d3,see data_parse.js
  data
    .then(function(d){
      d.sort(majorSort);
      cost = parseCost(d);
      colData = parseMajor(d);

      // Set schools array for school search typeahead
      schools = parseSchool(d);
      setSchools(schools);

      // Append chart to div
      var chart = genChart(d, cost, colData);

      return [chart, d];
    })
    .then(function(args) {
      var chart = args[0];
      var data = args[1];
      var yText = 10;

      // Set listener for the major filter
      $('#major-filter').change(function(e) {
        e.preventDefault();
        // Reset global major variable
        major = $('option:selected').text();
        yText = 10;

        // Filter undefined data
        var d = _.filter(data, function(datum){
          return datum[aid][roi][major] !== undefined;
        });

        // Sort data by major
        d.sort(majorSort);
        cost = parseCost(d);
        colData = parseMajor(d);

        // Reset typeahead list to current schools
        schools = parseSchool(d);
        setSchools(schools);

        // Regenerate Chart
        genChart(d, cost, colData);
        $('#active-major').text(major + ' Majors');
      });

      // Listener to highlight current school
      $('#school-filter').submit(function(e) {
        e.preventDefault();
        var school = $('#active-school').val();
        var i = schools.indexOf(school);
        var selector = '.c3-event-rect-' + i;
        var x = d3.select(selector).attr('x');
        var y = 0;
        var w = d3.select(selector).attr('width');
        var h = d3.select(selector).attr('height');
        
        d3.select('g').append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', w)
          .attr('height', h)
          .style('fill', '#1f77b4')
          .style('fill-opacity', '0.25');

        d3.select('g').append('text')
          .append('tspan')
            .attr('x', x)
            .attr('y', yText)
            .text(school)
          .append('tspan')
            .attr('x', x)
            .attr('y', yText + 15)
            .text('Cost: ' + cost[i])
          .append('tspan')
            .attr('x', x)
            .attr('y', yText + 30)
            .text('ROI: ' + colData[i]);

        yText += 50;
      });

    });

});


//***************************************************************
// Brainstorm
//***************************************************************

/*
BASIC REQUIREMENTS
[x] Convert to vertical bars
[x] On hover of a bar, display attributes of that School
[x] Sort (auto or sort button?)
[x] Search for school, highlight that bar, use typeahead
[x] Filter by major data
[x] Display cost as a stack

EXTRA CREDIT
[ ] Use nests to categorize data
[ ] Toggle 20 year net roi or annual roi
[ ] Toggle for seeing values with or without aid
[ ] Drop down for sort by category
[ ] On click of a bar...
[ ]   Open up school website on a new page (or Collegeboard website?)

NIGHTMARE MODE!
[ ] Incorporate crossfilter to show portions of data at a time (http://square.github.io/crossfilter/)
[ ] Add fish eye on hover of a bar

CLEAN UP TIME
[ ] Clean data 
[ ] Push live
[ ] Add readme
*/
