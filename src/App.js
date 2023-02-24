import React, {useEffect, useRef} from 'react'
import * as d3 from "d3";
import {
  axisBottom  as d3_axisBottom,
  axisLeft    as d3_axisLeft,
} from 'd3'
import data from './data.json'
import './App.css';


function App() {
  
  const svgRef = useRef();
  const btnRef = useRef();
  const colors = ['#ffffff', '#eff5fb', '#f1e4e7', '#fcf2ee', '#fff3d6', '#f3cece']

  const createGraph = async () => {

    data.forEach((d) => {
      d.x = d.x;
      d.y = d.y;
    });
    
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 860 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    
    // append the svg object to the body of the page
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add X axis and Y axis
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => { return d.x; }));
    y.domain([0, d3.max(data, (d) => { return d.y; })]);
  
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    // add grids
    const xAxisGrid = d3_axisBottom(x).tickSize(-height).tickFormat('').ticks(10);
    const yAxisGrid = d3_axisLeft(y).tickSize(-width).tickFormat('').ticks(10);

    svg.append('g')
      .attr('class', 'x axis-grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisGrid);
    svg.append('g')
      .attr('class', 'y axis-grid')
      .call(yAxisGrid);
      
    // add the Line
    var valueLine = d3.line()
      .x((d) => { return x(d.x); })
      .y((d) => { return y(d.y); });

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "rgb(132, 230, 252)")
      .attr("stroke-width", 2)
      .attr("d", valueLine);

    // add points
    const circles = svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("class","mouseCircle")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.x) })
        .attr("cy", function(d) { return y(d.y) })
        .attr("r", 4)
      
    // add drop lines
    svg.append("line")
      .attr("class","mouseLineHorizontal")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 0)
      .style("stroke-width", 1)
      .style("stroke", "green")
      .style("fill", "none")
      .style("opacity", "1");

    svg.append("line")
      .attr("class","mouseLineVertical")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", 0)
      .attr("y2", 0)
      .style("stroke-width", 1)
      .style("stroke", "green")
      .style("fill", "none")
      .style("opacity", "0");

    circles.on('mouseover', function () {
      d3.select(this).attr("fill", "green")
      d3.select(".mouseLineHorizontal")
      .attr("x1", d3.select(this).attr("cx"))
      .attr("y1", d3.select(this).attr("cy"))
      .attr("y2", d3.select(this).attr("cy"))
      .style("opacity", "1")
      d3.select(".mouseLineVertical")
      .attr("x1", d3.select(this).attr("cx"))
      .attr("x2", d3.select(this).attr("cx"))
      .attr("y2", d3.select(this).attr("cy"))
      .style("opacity", "1")
    })

    circles.on('mouseout', function () {
      d3.select(this).attr("fill", "red")
      d3.select(".mouseLineHorizontal")
        .style("opacity", "0");
      d3.select(".mouseLineVertical")
        .style("opacity", "0");
    })

    // change colors button
    const button = d3.select(btnRef.current)
    let colorIndex = 0;
    button.on("click", function() {
      if(colorIndex >= colors.length - 1){
        colorIndex = 0;
        d3.select(svgRef.current).style("background-color", colors[colorIndex]);
        return 
      }
      colorIndex++
      d3.select(svgRef.current).style("background-color", colors[colorIndex]);
    });
  }

  useEffect(() => {
    createGraph();
  }, []);

  return (
    <main>
      <svg ref={svgRef}></svg>
      <button ref={btnRef}>Change color</button>
    </main>
  );
}

export default App