import React, { useContext, useDeferredValue, useEffect } from 'react';
import * as d3 from "d3";
import USGSDataContext from './USGSDataContext';
import AuthContext from "./AuthContext";
import Weather from './Weather';
import RiverChart from './RiverChart';
import FavButton from './FavButton';
import {useLocation} from 'react-router-dom'

const River = (props) => {
    const location = useLocation();

    const {token} = React.useContext(AuthContext);
    const usgsDataProps = React.useContext(USGSDataContext);
    const pageType = location.pathname;
    const usgsId = props.values.usgsId;
    const d3Data = usgsDataProps.d3Data;
    const timeSeries = usgsDataProps.timeSeries;

    let river = {}

    for(let elem in timeSeries) {
        if(timeSeries[elem]['sourceInfo']['siteCode'][0]['value'] === usgsId){
            river['usgsId'] = usgsId;
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

    const highValue = totalMedian + totalMedian * 0.2;
    const lowValue = totalMedian - totalMedian * 0.2;
    
    let levelClass = 'mid';

    if(river['cfs'] > highValue){
      levelClass = 'high';
    } else if (river['cfs'] < lowValue) {
      levelClass = 'low';
    }

    river['histValues'] = {
        'seasonalMedian' : seasonalMedian,
        'totalMedian': totalMedian,
        'topBound': seasonalTopBound * 1.25
    }
    
    const url = `/river-detail/?id=${usgsId}`
    //TODO: if detail render chart. If fav don't render chart
    if(pageType === '/river-detail/'){
        return (
            <>
                <div className='container'>
                    <Weather river={river} />
                    <h3>{river['name']}</h3>
                    <FavButton river={river} />
                </div>
                <div className='detailBody'>
                    <RiverChart river={river} />
                </div>
            </>
        )
    }else if(pageType === '/favorites') {
        return (
            <div>
                <h3><a href={url}>{river['name']}</a></h3>
                <p>
                    <span className={levelClass}>
                        &#9650;
                    </span>
                    Current Level<br/>
                    <span>CFS: {river['cfs']}</span>
                </p>
                <Weather river={river} />
            </div>
        )
    }
}

export default River;