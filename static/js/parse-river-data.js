let parsed_data = '';

function make_d3_obj(clean_data){
  parsed_data = d3.tsvParse(clean_data);

  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth()+1;
  
  today_data = parsed_data.find(data => data.month_nu == month && data.day_nu == day);
  document.querySelector('#historical-values').innerHTML = `Mean Historic Value: ${today_data.p50_va}cfs`;
};

//fetch('/static/test_data.txt')
fetch('https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=09361500&statReportType=daily&statTypeCd=p25,p50,p75&parameterCd=00060')
  .then(response => response.text())
  .then(responseData => {
    //look for the last # then remove the stupid space that comes after it so I can access the actual data
    clean_data = responseData.substring(responseData.lastIndexOf("#")+2);
    make_d3_obj(clean_data);
  });