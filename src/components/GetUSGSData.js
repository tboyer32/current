import React from 'react';
import * as d3 from "d3";

const GetUSGSData = (props) => {
    //I'm making this component the top level of the river concept because we can batch
    //requests to the USGS API. Then I'll parse data and pass it to each individual river component

    //!!!!! GetUSGSData expects usgs ids to be sent in as a list, even if there's only one !!!!!

    const [histData, setHistData] = React.useState(null);
    const [instData, setInstData] = React.useState(null);

    let usgsIdString = null
    if(props.usgsIds.length === 1){
        usgsIdString = props.usgsIds[0];
    }else{
        usgsIdString = props.usgsIds.toString();
    }

    React.useEffect(() => {
        fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsIdString}&statReportType=daily&statTypeCd=mean,max,p25,p50,p75&parameterCd=00060`)
        .then(response => response.text())
        .then(responseData => {
        //look for the last # then remove the stupid space that comes after it so I can access the actual data
        const cleanData = responseData.substring(responseData.lastIndexOf("#")+2);
        const d3Data = d3.tsvParse(cleanData);
        setHistData(d3Data);
        });
    }, []);

    React.useEffect(() => {
        fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${usgsIdString}&parameterCd=00060&siteStatus=all`)
        .then(response => response.json())
        .then(responseData => {
        const timeseries = responseData['value']['timeSeries'];
        setInstData(timeseries);   
        });
    }, []);

    let rivers = []
    let usgsDataChildren = null;

    //sort through the data
    if(histData && instData){

        for(let id in props.usgsIds){

            const river = {
                usgsId: instData[id]['sourceInfo']['siteCode'][0]['value'],
                name: instData[id]['sourceInfo']['siteName'],
                lon: instData[id]['sourceInfo']['geoLocation']['geogLocation']['longitude'],
                lat: instData[id]['sourceInfo']['geoLocation']['geogLocation']['latitude'],
                cfs: instData[id]['values'][0]['value'][0]['value'],
                histValues: histData.filter(function(d){ return d.site_no == props.usgsIds[id] })
            }
            rivers.push(river);
        }
        // Not sure this is going to work with multiples?? Actually, it totally should because Rivers is an array
        usgsDataChildren = React.Children.map(props.children, child =>
            React.cloneElement(child, { usgsProps: rivers })
        );
    }

    return (
        <>
            {usgsDataChildren}
        </>
        //change the key to the usgs_id
        // rivers.map((elem, i) => {
        //     return <River key={i} data={elem} />
        // })
    )

}

export default GetUSGSData;

