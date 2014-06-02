
//***************************************************************
// Helper Functions for college_roi.js
//***************************************************************

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
};