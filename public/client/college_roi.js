// Data toggles variables
var major = 'All';
var aid = 'withoutAid';
var roi = 'netROI';

$(function () {
  // Load data using d3,see data_parse.js
  data
    .then(function(d){
      // Get data
      var cost = parseCost(d);
      var colData = parseMajor(d, cost);

      // Append chart to div
      var chart = c3.generate({
        bindto: '#chart',
        
        data: {
          columns: [
            ['Cost'].concat(cost),
            ['Major'].concat(colData),
          ],
          type: 'bar',
          colors: {
            Cost: '#ff7f0e',
            Major: '#1f77b4'
          },
          groups: [
            ['Major', 'Cost']
          ],
          names: {
            Major: '20yr Net ROI'
          }
        },

        transition: {
          duration: 800
        },

        tooltip: {
          format: {
            title: function(i) { return (i+1) + '. ' + d[i].school; },
            value: function(value) {
              var format = roi === 'netROI' ? d3.format('$,') : d3.format('.');
                return format(value);
            }
          }
        },

        // Chart Formatting
        grid: {
          y: { // For negative values
            lines: [{value: 0}]
          }
        },
        axis: {
          x: {
            show: false,
          },
          y: {
            show: true,
            tick: {
              format: d3.format('$,')
            }
          }
        },
        padding: {
          bottom: 20
        }
      });

      return [chart, d];
    })
    .then(function(args) { // What is d?
      var chart = args[0];
      var data = args[1];

      // Set listener for the major filter
      $('#major-filter').submit(function(e) {
        major = $('#active-major').val(); // Reset global major variable
        // Reset financial 'aid' variable
        // Reload data
        var cost = parseCost(data);
        var colData = parseMajor(data, cost);
        chart.load({
          unload: ['Cost', 'Major'],
          columns: [
            ['Cost'].concat(cost),
            ['Major'].concat(colData),
          ],
        });
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

  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
   
      // an array that will be populated with substring matches
      matches = [];
   
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
   
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          // the typeahead jQuery plugin expects suggestions to a
          // JavaScript object, refer to typeahead docs for more info
          matches.push({ value: str });
        }
      });
   
      cb(matches);
    };
  };
   
  var majors = ['Art', 'Humanities', 'Computer Science', 'Mathematics', 'Business', 'Economics', 'Nursing', 'Life Sciences', 'Political Science', 'History', 'English', 'Education', 'All'
  ];
   
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
// Helper Functions
//***************************************************************

function parseMajor(d, cost) {
  return _.chain(d)
    .pluck(aid)
    .pluck(roi)
    .pluck(major)
    .filter(function(val) { return val !== undefined; })
    .map(function(val, i) { return val - cost[i]; })
    .value();
}

function parseCost(d) {
  return _.chain(d)
    .pluck(aid)
    .filter(function(val) { return val[roi][major] !== undefined; })
    .pluck('cost')
    // .map(function(num) { return -num; }) // Make cost a negative value
    .value();
}


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
