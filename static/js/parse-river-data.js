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
  }
}

function initRivers(usgsIds, cfsValues, data) {
  for (const i in usgsIds) {
    //pass only the data for the each individual river
    const riverData = data.filter(function(d){ return d.site_no == usgsIds[i] });
    //create a new river object
    const my_river = new River(usgsIds[i], cfsValues[i], riverData);
    //display the historical data - eventually build the graph here.
    my_river.dispHistMean();
  }
}

//get the usgs historical values for all rivers on page
fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsIds}&statReportType=daily&statTypeCd=mean,p25,p50,p75&parameterCd=00060`)
  .then(response => response.text())
  .then(responseData => {
    //look for the last # then remove the stupid space that comes after it so I can access the actual data
    const cleanData = responseData.substring(responseData.lastIndexOf("#")+2);
    const data = d3.tsvParse(cleanData);

    const usgsIdArr = usgsIds.split(',');
    const cfsValuesArr = cfsValues.split(',');

    initRivers(usgsIdArr, cfsValuesArr, data)
  });

