import React, {useEffect, useRef, useState} from 'react'
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
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    
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
      
    // add the Line
      var valueLine = d3.line()
    .x((d) => { return x(d.x); })
    .y((d) => { return y(d.y); });

    // add points
    svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function(d) { return x(d.x) })
      .attr("cy", function(d) { return y(d.y) })
      .attr("r", 4)


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

    svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "rgb(132, 230, 252)")
    .attr("stroke-width", 2)
    .attr("d", valueLine);
    
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