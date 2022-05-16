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

    const height = 300;
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

      // Append a rect element to the group and set its properties.
      // The background color of an SVG element is set using the "fill" property.
      group
        .append('rect')
        .attr('height', barHeight)
        .attr('width', barWidth)
        .attr('x', 25)
        .attr('y', height - barHeight)
        .attr('fill', 'cornflowerblue');

      group
        .append('line')
        .style("stroke", "lightgreen")
        .style("stroke-width", 4)
        .attr('x1', 0)
        .attr('y1', seasonalMeanPos)
        .attr('x2', width)
        .attr('y2', seasonalMeanPos);

      group
        .append('line')
        .style("stroke", "orange")
        .style("stroke-width", 4)
        .attr('x1', 0)
        .attr('y1', histMeanPos)
        .attr('x2', width)
        .attr('y2', histMeanPos);

      // Append a text element to the group and set its properties.
      group
        .append('text')
        .text(currentFlow)
        .attr('x', barWidth / 2) // center horizontally in bar
        .attr('y', height - barHeight + 20); // just below top
    }, []);

  return (
    <>
      <svg ref={svgRef} id="riverGraph" ></svg>
    </>
  )

}

export default RiverChart;
