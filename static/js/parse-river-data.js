//modify this to:
// take in one or multiple site numbers DONE
// if we're on the detail page do what we're already doing for now
// if we're on the favs page compare the historical value to the current value 
// and say whether the river is low, average, or high
  //do we need another data attribute to tell which page we're on?
  //convert the make_historical_data_obj to return the object
  //add a script to each page to display relevant data?

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
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth()+1;
    const today_data = this.data.find(data => data.month_nu == month && data.day_nu == day);
    return today_data.mean_va;
  }
  dispHistMean() {
    document.querySelector(`#hist${this.usgsId}`).innerHTML = this.histMean;
  }
}

fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsIds}&statReportType=daily&statTypeCd=mean,p25,p50,p75&parameterCd=00060`)
  .then(response => response.text())
  .then(responseData => {
    //look for the last # then remove the stupid space that comes after it so I can access the actual data
    const formattedData = responseData.substring(responseData.lastIndexOf("#")+2);
    data = d3.tsvParse(formattedData);

    const usgsIdArr = usgsIds.split(',');
    const cfsValuesArr = cfsValues.split(',');

    for (const i in usgsIdArr) {
      //pass only the data for the individual river
      const riverData = data.filter(function(d){ return d.site_no == usgsIdArr[i] });

      const my_river = new River(usgsIdArr[i], cfsValuesArr[i], riverData);
      console.log(my_river.histMean);
      console.log(my_river.cfsValue);
      my_river.dispHistMean();
    }
  });