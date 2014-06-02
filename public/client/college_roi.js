// Data toggles variables
var major = 'All';
var aid = 'withoutAid';
var roi = 'netROI';
var majors = [
  'All',
  'Art',
  'Business',
  'Computer Science',
  'Economics',
  'Education',
  'English',
  'Humanities',
  'Life Sciences',
  'Mathematics',
  'Nursing',
  'Political Science',
];

$(function () {
  // Load data using d3,see data_parse.js
  data
    .then(function(d){
      d.sort(majorSort);
      var cost = parseCost(d);
      var colData = parseMajor(d);

      // Set schools array for school search typeahead
      setSchools(parseSchool(d));

      // Append chart to div
      var chart = genChart(d, cost, colData);

      return [chart, d];
    })
    .then(function(args) {
      var chart = args[0];
      var data = args[1];

      // Set listener for the major filter
      $('#major-filter').submit(function(e) {
        major = $('#active-major').val(); // Reset global major variable
        // Reset financial 'aid' variable
        // Reload data

        // Filter undefined data
        var d = _.filter(data, function(datum){
          return datum[aid][roi][major] !== undefined;
        });

        //sort data by major
        d.sort(majorSort);
        var cost = parseCost(d);
        var colData = parseMajor(d);

        // Reset typeahead list to current schools
        setSchools(parseSchool(d));

        // Regenerate Chart
        genChart(d, cost, colData);
        $('#active-major').text(major + ' Majors');
        e.preventDefault();
      });

      // Listener to highlight current school
      // $('#school-filter').submit(function(e) {
      //   var school = $('#active-school').val();
      //   chart.load({
      //     unload: ['Cost', 'Major'],
      //     columns: [
      //       ['Cost'].concat(cost),
      //       ['Major'].concat(colData),
      //     ],
      //   });
      //   $('#active-major').text(major + ' Majors');
      //   e.preventDefault();
      // });

    });
  
  // Typeahead
  $('#major-filter .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'majors',
    displayKey: 'value',
    source: substringMatcher(majors)
  });
});


//***************************************************************
// Brainstorm
//***************************************************************

/*
BASIC REQUIREMENTS
[x] Convert to vertical bars
[x] On hover of a bar, display attributes of that School
[ ] Sort (auto or sort button?)
[ ] Search for school, highlight that bar, use typeahead
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
