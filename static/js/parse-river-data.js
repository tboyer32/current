//Do we want to run add and delete favorites and the instantaneous values through this object?

const usgsIds = document.querySelector('#parser').getAttribute("data-usgsIds");
const cfsValues = document.querySelector('#parser').getAttribute("data-cfsValues");

class River {
  constructor(usgsId, cfsValue, data) {
    this.usgsId = usgsId;
    this.cfsValue = cfsValue;
    this.data = data;
  }
  get histMean() {
    return this.calcHistMean();
  }
  calcHistMean() {
    //need to update this so it calculates based on an entire column rather than one day
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth()+1;
    const today_data = this.data.find(data => data.month_nu == month && data.day_nu == day);
    
    //eventually we'll want this for graphing purposes
    const total_median = d3.median(this.data, d => d.mean_va);

    return today_data.mean_va;
  }
  dispHistMean() {
    //looks for an element with an id of #hist{usgsId} and displays the data
    document.querySelector(`#hist${this.usgsId}`).innerHTML = this.histMean;
    console.log(this.data)
  }
}

function initRivers(usgsIds, cfsValues, data) {
  for (const i in usgsIds) {
    //pass only the data for the each individual river
    const riverData = data.filter(function(d){ return d.site_no == usgsIds[i] });
    
    //create a new river object
    const my_river = new River(usgsIds[i], cfsValues[i], riverData);
    
    //display the historical data - eventually this will build the graph.
    my_river.dispHistMean();
  }
}

//TODO change url to have start date in the last 30 or so years and have an end date of today

//get the usgs historical values for all rivers on page
fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsIds}&statReportType=daily&statTypeCd=mean,max,p25,p50,p75&parameterCd=00060`)
  .then(response => response.text())
  .then(responseData => {
    //look for the last # then remove the stupid space that comes after it so I can access the actual data
    const cleanData = responseData.substring(responseData.lastIndexOf("#")+2);
    const data = d3.tsvParse(cleanData);

    const usgsIdArr = usgsIds.split(',');
    const cfsValuesArr = cfsValues.split(',');

    initRivers(usgsIdArr, cfsValuesArr, data)
  });


// if the river is unusually high, the bar should be at the top of the chart
// if the river is average or low where should the top of the chart be?
// the max value is in general too high. Do we go some percentage over the total historical mean??
// bar should be percentage of total height, obviously
// add a marker at mean for this day
// add a marker at total mean

const HEIGHT = 300;
const WIDTH = 400;
const score = 7; // out of 10
const barHeight = HEIGHT * (score / 10);
const barWidth = 50;
 
// Find the DOM element with an id of "chart" and set its width and height.
// This happens to be an svg element.
const svg = d3.select('#chart').attr('width', WIDTH).attr('height', HEIGHT);
 
// Append a group element to the svg and add a CSS class of "bar".
const group = svg.append('g').attr('class', 'bar');
 
// Append a rect element to the group and set its properties.
// The background color of an SVG element is set using the "fill" property.
group
  .append('rect')
  .attr('height', barHeight)
  .attr('width', barWidth)
  .attr('x', 0)
  .attr('y', HEIGHT - barHeight)
  .attr('fill', 'cornflowerblue');
 
// Append a text element to the group and set its properties.
group
  .append('text')
  .text(score)
  .attr('x', barWidth / 2) // center horizontally in bar
  .attr('y', HEIGHT - barHeight + 20); // just below top