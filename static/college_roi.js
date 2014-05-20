// Data toggles variables
var
  major = 'All Majors';
  aid = 'withoutAid';
  roi = 'netROI';

// Load data using data_parse.js
data
  .then(function(d){
    // Choose the data column to chart
    var colData = _.chain(d)
      .pluck(aid)
      .pluck(roi)
      .pluck(major)
      .value();

    var cost = _.chain(d)
      .pluck(aid)
      .pluck('cost')
      .map(function(num) { return -num; })
      .value();

    // Append chart to div
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          [major].concat(colData),
          ['Cost'].concat(cost),
        ],
        type: 'bar',
        groups: [
          ['Cost', major] // ERROR: Negative values are stacked
        ]
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
      }
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
[ ] Display cost as a stack
[ ] Drop down to select all or major data

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
