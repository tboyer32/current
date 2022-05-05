const usgsIds = document.querySelector('#parser').getAttribute("data-usgsIds");
const cfsValues = document.querySelector('#parser').getAttribute("data-cfsValues");

class River {
  constructor(usgsId, cfsValue, data) {
    this.usgsId = usgsId;
    this.cfsValue = cfsValue;
    this.data = data;
  }
  get histValues() {
    return this.calcHistValues();
  }
  calcHistValues() {
    //need to update this so it calculates based on an entire column rather than one day
    let currentTime = new Date();
    const currentDay = currentTime.getDate();
    const currentMonth = currentTime.getMonth()+1;

    //create a new Date object - setting a date that's plus and minus the specified range
    const getBeginRange = new Date(currentTime.setDate(currentTime.getDate()-14));
    const getEndRange = new Date(currentTime.setDate(currentTime.getDate()+30));

    const bounds = {
      startMonth : getBeginRange.getMonth()+1,
      endMonth : getEndRange.getMonth()+1,
      startDay : getBeginRange.getDate(),
      endDay : getEndRange.getDate()
    }

    //const today_data = this.data.find(data => data.month_nu == month && data.day_nu == day);
    const seasonalData = this.data.filter((d) => {
          const past = d.day_nu >= bounds.startDay && d.month_nu == bounds.startMonth;
          const future = d.day_nu <= bounds.endDay && d.month_nu == bounds.endMonth;
          return past+future;
    });

    const seasonalMedian = d3.median(seasonalData, d => d.mean_va);
    const seasonalTopBound = d3.median(seasonalData, d => d.p75_va);

    //get the total historical median - includes all dates
    const totalMedian = d3.median(this.data, d => d.mean_va);

    const histValues = {
      seasonalMedian : seasonalMedian,
      totalMedian: totalMedian,
      topBound: seasonalTopBound * 1.25
    }

    return histValues;
  }
  dispTotalMedian() {
    document.querySelector(`#hist${this.usgsId}`).innerHTML = this.histValues.totalMedian;
  }
  displayBarChart() {
    const height = 300;
    const width = 400;
    const currentFlow = this.cfsValue; 
    const barHeight = height * (currentFlow / this.histValues.topBound);
    const barWidth = 50;
    
    // Find the DOM element with an id of "chart" and set its width and height.
    // This happens to be an svg element.
    const svg = d3.select('#chart').attr('width', width).attr('height', height);
    
    // Append a group element to the svg and add a CSS class of "bar".
    const group = svg.append('g').attr('class', 'bar');
    
    // Append a rect element to the group and set its properties.
    // The background color of an SVG element is set using the "fill" property.
    group
      .append('rect')
      .attr('height', barHeight)
      .attr('width', barWidth)
      .attr('x', 0)
      .attr('y', height - barHeight)
      .attr('fill', 'cornflowerblue');
    
    // Append a text element to the group and set its properties.
    group
      .append('text')
      .text(currentFlow)
      .attr('x', barWidth / 2) // center horizontally in bar
      .attr('y', height - barHeight + 20); // just below top
  }
}

function initRivers(usgsIds, cfsValues, data) {
  for (const i in usgsIds) {
    //pass only the data for the each individual river
    const riverData = data.filter(function(d){ return d.site_no == usgsIds[i] });
    
    //create a new river object
    const myRiver = new River(usgsIds[i], cfsValues[i], riverData);
    
    //display the historical data - eventually this will build the graph.
    myRiver.dispTotalMedian();
    myRiver.displayBarChart();
  }
}

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


