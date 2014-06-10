# College ROI

## About this project
This project visualizes college ROI data from PayScale's 2014 report http://www.payscale.com/college-roi/full-list. Colleges are typically evaluated by their rankings on various public lists such as the US News Report. This project aims to focus the discussion of college rank around return on investment which is based on an earnings differential ("the difference between the 20 Year Median Pay for a 2013 Bachelor’s Graduate and Weighted 24-26 Year Median Pay for a High School") and the cost of tuition. Read about how PayScale's methodology for formulating this data set here: http://www.payscale.com/college-roi/c/methodology

The data can be filtered by the ROI for a specific major and you can select specific schools to see where they rank.

See the deployed app at http://collegeroi.emilydee.com/
![alt tag](http://emilydeedotcom1.files.wordpress.com/2014/06/screen-shot-2014-06-03-at-5-30-22-pm.png?w=630&h=319)

## Tech Stack and Code Structure
This project uses C3.js, D3.js, Node, Express, Bootstrap and Grunt.

The data is pulled in from public/data.csv using d3.csv in public/client/data_parse.js. Each datapoint is converted into an object in the following form:
```javascript
{
  school: xxx,
  gradRate: xxx,
  withoutAid: {
    cost: xxx,
    netROI: {
      <list of all available majors>
    }
    annualROI: {
      <list of all available majors>
    }
  },
  withAid: {
    cost: xxx,
    netROI: {
      <list of all available majors>
    }
    annualROI: {
      <list of all available majors>
    }
  },
};
```

C3.js displays the netROI of all the colleges in a specific major as one column and cost as another column.

===
Read more about the development process here: http://emilydee.com/2014/06/04/hr-hackathon/
