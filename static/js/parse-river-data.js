//modify this to:
// take in one or multiple site numbers
// modifity more than one dom element
// take in a parameter (list of sites) from a function call


const usgsId = document.querySelector('#parser').getAttribute("data-usgsId");

function make_d3_obj(clean_data){ //rename this function to be more specific
  const parsed_data = d3.tsvParse(clean_data);

  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth()+1;
  
  today_data = parsed_data.find(data => data.month_nu == month && data.day_nu == day);
  document.querySelector('#historical-values').innerHTML = `Median Historic Value: <b>${today_data.p50_va} cfs</b>`;
};

fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsId}&statReportType=daily&statTypeCd=p25,p50,p75&parameterCd=00060`)
  .then(response => response.text())
  .then(responseData => {
    //look for the last # then remove the stupid space that comes after it so I can access the actual data
    clean_data = responseData.substring(responseData.lastIndexOf("#")+2);
    make_d3_obj(clean_data);
  });