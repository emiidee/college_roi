// Data toggles variables
var major = 'All';
var aid = 'withoutAid';
var roi = 'netROI';

$(function () {
  // Load data using d3,see data_parse.js
  data
    .then(function(d){
      // Get data
      var colData = parseMajor(d);
      var cost = parseCost(d);

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
            title: function(i) { return d[i].school; },
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
        var colData = parseMajor(data);
        var cost = parseCost(data);
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
});

//***************************************************************
// Helper Functions
//***************************************************************

function parseMajor(d) {
  return _.chain(d)
    .pluck(aid)
    .pluck(roi)
    .pluck(major)
    .filter(function(val) { return val !== undefined; })
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
;var csv = Promise.promisify(d3.csv);

// Returns a promise of an array of objects
var data = csv('/data.csv', type);


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