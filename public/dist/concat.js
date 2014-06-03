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
;
//***************************************************************
// Helper Functions for college_roi.js
//***************************************************************

// Get schools list from data
function parseSchool(d) {
  return _.chain(d)
    .pluck('school')
    .filter(function(val) { return val !== undefined; })
    .map(function(val, i) { return (i+1) + '. ' + val; })
    .value();
}

// Get data for the selected major
function parseMajor(d) {
  return _.chain(d)
    .pluck(aid)
    .pluck(roi)
    .pluck(major)
    .filter(function(val) { return val !== undefined; })
    .value();
}

// Get cost data
function parseCost(d) {
  return _.chain(d)
    .pluck(aid)
    .filter(function(val) { return val[roi][major] !== undefined; })
    .pluck('cost')
    // .map(function(num) { return -num; }) // Make cost a negative value
    .value();
}

// Sort function for sorting by the current selected major
function majorSort(a, b) {
  var diff =  (b[aid][roi][major] + b[aid].cost) - (a[aid][roi][major] + a[aid].cost);
  if (diff > 0) {
    return 1;
  } else if (diff < 0) {
    return -1;
  } else {
    return 0;
  }
}

// Generate a chart and bind it to the html element #chart
function genChart(d, cost, colData) {
  c3.generate({
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
}

// Typeahead
function substringMatcher(strs) {
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
}

// Set typeahead list for schools
function setSchools(schools) {
  $('#school-filter .typeahead').typeahead('destroy');

  $('#school-filter .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'schools',
    displayKey: 'value',
    source: substringMatcher(schools)
  });
};var csv = Promise.promisify(d3.csv);

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