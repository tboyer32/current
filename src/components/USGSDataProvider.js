import React, { useContext, useDeferredValue, useEffect } from 'react';
import * as d3 from "d3";
import USGSDataContext from './USGSDataContext';

const USGSDataProvider = (props) => {
    //I'm making this component the top level of the river concept because we can batch
    //requests to the USGS API. Then I'll parse data and pass it to each individual river component
    //!!!!! USGSDataProvider expects usgs ids to be sent in as a list, even if there's only one !!!!!

    const [d3Data, setD3Data] = React.useState(null);
    const [timeSeries, setTimeSeries] = React.useState(null);

    let usgsIdString = null;
    
    if(props.usgsIds.length === 1){
        usgsIdString = props.usgsIds[0];
    } else {
        usgsIdString = props.usgsIds.toString();
    }

    React.useEffect(() => {
        fetch(`https://waterservices.usgs.gov/nwis/stat/?format=rdb,1.0&sites=${usgsIdString}&statReportType=daily&statTypeCd=mean,max,p25,p50,p75&parameterCd=00060`)
        .then(response => response.text())
        .then(responseData => {
        //look for the last # then remove the stupid space that comes after it so I can access the actual data
            const cleanData = responseData.substring(responseData.lastIndexOf("#")+2);
            setD3Data(d3.tsvParse(cleanData));
        });
        fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${usgsIdString}&parameterCd=00060&siteStatus=all`)
        .then(response => response.json())
        .then(responseData => {
            setTimeSeries(responseData['value']['timeSeries']);
        });
    }, []);

    if(d3Data != null && timeSeries != null){
        const riverData = {'d3Data': d3Data, 'timeSeries': timeSeries}
        return (
            <>
                <USGSDataContext.Provider value={riverData}>  
                    {props.children}
                </USGSDataContext.Provider>
            </>
        )
    }

    return


    // Not sure this is going to work with multiples?? Actually, it totally should because Rivers is an array
    // usgsDataChildren = React.Children.map(props.children, child =>
    //     React.cloneElement(child, { usgsProps: rivers })
    // );

}

export default USGSDataProvider;

