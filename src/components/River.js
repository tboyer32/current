import React, { useContext, useDeferredValue, useEffect } from 'react';
import * as d3 from "d3";
import USGSDataContext from './USGSDataContext';
import Weather from './Weather';
import RiverChart from './RiverChart';

const River = (props) => {
    const usgsDataProps = React.useContext(USGSDataContext);
    const pageType = props.values.pageType;
    const usgsId = props.values.usgsId;
    const d3Data = usgsDataProps.d3Data;
    const timeSeries = usgsDataProps.timeSeries;

    let river = {}

    for(let elem in timeSeries) {
        if(timeSeries[elem]['sourceInfo']['siteCode'][0]['value'] === usgsId){
            river['name'] = timeSeries[elem]['sourceInfo']['siteName'];
            river['lon'] = timeSeries[elem]['sourceInfo']['geoLocation']['geogLocation']['longitude'];
            river['lat'] = timeSeries[elem]['sourceInfo']['geoLocation']['geogLocation']['latitude'];
            river['cfs'] = timeSeries[elem]['values'][0]['value'][0]['value'];
        }
    }

    river['riverHist'] = d3Data.filter(function(d){ return d.site_no === usgsId });

    //need to update this so it calculates based on an entire column rather than one day
    let currentTime = new Date();

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
    const seasonalData = river['riverHist'].filter((d) => {
            const past = d.day_nu >= bounds.startDay && d.month_nu == bounds.startMonth;
            const future = d.day_nu <= bounds.endDay && d.month_nu == bounds.endMonth;
            return past+future;
    });

    const seasonalMedian = d3.median(seasonalData, d => d.mean_va);
    const seasonalTopBound = d3.median(seasonalData, d => d.p75_va);
    //get the total historical median - includes all available dates
    const totalMedian = d3.median(river['riverHist'], d => d.mean_va);

    river['histValues'] = {
        'seasonalMedian' : seasonalMedian,
        'totalMedian': totalMedian,
        'topBound': seasonalTopBound * 1.25
    }
    
    //TODO: if detail render chart. If fav don't render chart
    if(pageType === 'detail'){
        return (
            <>
                <Weather river={river} />
                <RiverChart river={river} />
            </>
        )
    }else if(pageType === 'favorite') {
        return (
            <>
                <Weather river={river} />
            </>
        )
    }
}

export default River;