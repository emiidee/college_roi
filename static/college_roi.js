// Declare variables
var
  // Chart settings
  width = 960;
  height = 500;
  // Data toggles
  major = 'all';
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

    // Append chart to div
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [['data'].concat(colData)],
        type: 'bar'
      },
      grid: {
        y: {
          lines: [{value: 0}]
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