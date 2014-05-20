var csv = Promise.promisify(d3.csv);

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