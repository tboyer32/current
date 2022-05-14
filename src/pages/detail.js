import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Weather from '../components/Weather';
import RiverChart from '../components/RiverChart';

// import * as d3 from "d3";
import USGSDataProvider from '../components/USGSDataProvider';
import RiverDataProvider from '../components/RiverDataProvider';


//TODO: Need db river_id to manage favorites
//TODO: Get all data (whether one or many rivers) in one big component. Then pass to children

export default function Detail(props) {  
  const [searchParams] = useSearchParams();
  
  //only doing this on the detail page
  const usgsId = searchParams.get('id');

  //on the favs page we'll have to split the usgs array into a comma separated string

  // const River = (props) => {

  //   const riverPropsArray = React.useContext(RiverDataContext);

  //   //will need to do a check here for a key to handle the favorites page
  //   const riverProps = riverPropsArray[0]

  //   //const riverProps = props.usgsProps[0];
  //   const [weatherData, setWeatherData] = React.useState(null);
  //   const svgRef = React.useRef(null);

  //   //weather
  //   React.useEffect(() => {
  //     fetch(`/weather.json?lat=${riverProps.lat}&lon=${riverProps.lon}`)
  //     .then(response => response.json())
  //     .then(responseData => {
  //       setWeatherData(responseData);
  //     })
  //   }, []);

  //   if(weatherData){
  //     console.log(weatherData);
  //   }

  //   //D3 chart
  //   function calcHistValues(d3Data) {
  //     //need to update this so it calculates based on an entire column rather than one day
  //     let currentTime = new Date();
  
  //     //create a new Date object - setting a date that's plus and minus the specified range
  //     const getBeginRange = new Date(currentTime.setDate(currentTime.getDate()-14));
  //     const getEndRange = new Date(currentTime.setDate(currentTime.getDate()+30));
  
  //     const bounds = {
  //       startMonth : getBeginRange.getMonth()+1,
  //       endMonth : getEndRange.getMonth()+1,
  //       startDay : getBeginRange.getDate(),
  //       endDay : getEndRange.getDate()
  //     }
  
  //     //const today_data = d3Data.find(data => data.month_nu == month && data.day_nu == day);
  //     const seasonalData = d3Data.filter((d) => {
  //           const past = d.day_nu >= bounds.startDay && d.month_nu == bounds.startMonth;
  //           const future = d.day_nu <= bounds.endDay && d.month_nu == bounds.endMonth;
  //           return past+future;
  //     });
  
  //     const seasonalMedian = d3.median(seasonalData, d => d.mean_va);
  //     const seasonalTopBound = d3.median(seasonalData, d => d.p75_va);
  //     //get the total historical median - includes all available dates
  //     const totalMedian = d3.median(d3Data, d => d.mean_va);
  
  //     const histValues = {
  //       seasonalMedian : seasonalMedian,
  //       totalMedian: totalMedian,
  //       topBound: seasonalTopBound * 1.25
  //     }
      
  //     return histValues;
  //   }

  //   const histValues = calcHistValues(riverProps.histValues);
  //   const cfsValue = riverProps.cfs;

  //   function dispBarChart(histValues, cfsValue) {
  //     let topBound = histValues.topBound;
  //     if (histValues.topBound < cfsValue){
  //       topBound = cfsValue * 1.1; //add 10% to the top to give a little margin
  //     }
  
  //     const height = 300;
  //     const width = 400;
  //     const currentFlow = cfsValue; 
  //     const barHeight = height * (currentFlow / topBound);
  //     const barWidth = 350;
  //     const histMeanPos = height * (histValues.totalMedian / topBound);
  //     const seasonalMeanPos = height * (histValues.seasonalMedian / topBound);
  
  //     // Find the DOM element with an id of "chart" and set its width and height.
  //     const svgEl = d3.select(svgRef.current).attr('width', width).attr('height', height);
      
  //     // Append a group element to the svg and add a class of "bar".
  //     const group = svgEl.append('g').attr('class', 'bar');

  //     // Append a rect element to the group and set its properties.
  //     // The background color of an SVG element is set using the "fill" property.
  //     group
  //       .append('rect')
  //       .attr('height', barHeight)
  //       .attr('width', barWidth)
  //       .attr('x', 25)
  //       .attr('y', height - barHeight)
  //       .attr('fill', 'cornflowerblue');
  
  //     group
  //       .append('line')
  //       .style("stroke", "lightgreen")
  //       .style("stroke-width", 4)
  //       .attr('x1', 0)
  //       .attr('y1', seasonalMeanPos)
  //       .attr('x2', width)
  //       .attr('y2', seasonalMeanPos);
  
  //     group
  //       .append('line')
  //       .style("stroke", "orange")
  //       .style("stroke-width", 4)
  //       .attr('x1', 0)
  //       .attr('y1', histMeanPos)
  //       .attr('x2', width)
  //       .attr('y2', histMeanPos);
  
  //     // Append a text element to the group and set its properties.
  //     group
  //       .append('text')
  //       .text(currentFlow)
  //       .attr('x', barWidth / 2) // center horizontally in bar
  //       .attr('y', height - barHeight + 20); // just below top
  //   }

  //   dispBarChart(histValues, cfsValue);


  //   return (
  //     <>
  //       <svg ref={svgRef}></svg>
  //     </>
  //   )

  // }

  return (
    <main>
      <h3>River Detail View</h3>
      <USGSDataProvider usgsIds={[usgsId]}>
        <RiverDataProvider usgsId={usgsId} >
          <Weather />
          <RiverChart />
        </RiverDataProvider>
      </USGSDataProvider>
    </main>
  );

};
