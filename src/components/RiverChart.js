import React from "react";
import * as d3 from "d3";

const RiverChart = (props) => {
    //D3 chart
    const svgRef = React.useRef(null);

    const [riverProps, setRiverProps] = React.useState(props.river)

    //will need to do a check here for a key to handle the favorites page
    const histValues = riverProps['histValues'];
    const cfsValue = riverProps['cfs'];

    let topBound = histValues.topBound;
    if (histValues.topBound < cfsValue){
      topBound = cfsValue * 1.1; //add 10% to the top to give a little margin
    }

    const height = 450;
    const width = 400;
    const currentFlow = cfsValue; 
    const barHeight = height * (currentFlow / topBound);
    const barWidth = 350;
    const histMeanPos = height * (histValues.totalMedian / topBound);
    const seasonalMeanPos = height * (histValues.seasonalMedian / topBound);

    React.useEffect(() => {
      // Find the DOM element with an id of "chart" and set its width and height.
      const svgEl = d3.select(svgRef.current).attr('width', width).attr('height', height);
      // Append a group element to the svg and add a class of "bar".
      const group = svgEl.append('g').attr('class', 'bar');
        
      //cute little wave
      group
        .append("svg:image")
        .attr("xlink:href", "/images/wave.png")
        .attr("width", 350)
        .attr('x', 25)
        .attr('y', height-barHeight-20)
        .attr("height", 20);

      // Append a rect element to the group and set its properties.
      // The background color of an SVG element is set using the "fill" property.
      group
        .append('rect')
        .attr('height', barHeight)
        .attr('width', barWidth)
        .attr('x', 25)
        .attr('y', height - barHeight)
        .attr('fill', 'url(#gradient)');

      group //current value
        .append('line')
        .style("stroke", "#F14888")
        .style("stroke-width", 3)
        .attr('x1', 0)
        .attr('y1', height-barHeight-10)
        .attr('x2', width)
        .attr('y2', height-barHeight-10);

      group //seasonal mean
        .append('line')
        .style("stroke-dasharray", ("8, 4"))
        .style("stroke", "white")
        .style("stroke-width", 2)
        .attr('x1', 0)
        .attr('y1', height-seasonalMeanPos)
        .attr('x2', width)
        .attr('y2', height-seasonalMeanPos);

      group //historical mean
        .append('line')
        .style("stroke-dasharray", ("8, 4"))
        .style("stroke", "white")
        .style("stroke-width", 2)
        .attr('x1', 0)
        .attr('y1', height-histMeanPos)
        .attr('x2', width)
        .attr('y2', height-histMeanPos);
      
      const grad = group.append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 1);

      grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#1BD9FF');

      grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#16B3FF');

    }, []);

  return (
    <div className="container">
      <div className="chartContainer">
        <div className="currentTip" style={{top: height - barHeight-9}}><h4>Current Value</h4><p>{cfsValue} CFS</p></div>
        <div className="seasonalTip" style={{top: height-seasonalMeanPos-24}}><h4>Seasonal Average</h4><p>{histValues.seasonalMedian} CFS</p></div>
        <div className="historicalTip" style={{top: height-histMeanPos-24}}><h4>Historical Average</h4><p>{histValues.totalMedian} CFS</p></div>
        <svg ref={svgRef} id="riverChart" ></svg>
      </div>
    </div>
  )

}

export default RiverChart;
