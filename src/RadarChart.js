import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const attributes = ['Total', 'Quantity', 'Status'];
    const categories = Array.from(new Set(data.map(entry => entry.Category)));

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(chartRef.current).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const angleScale = d3.scalePoint()
      .domain(attributes)
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.Total)])
      .range([0, radius]);

    const line = d3.lineRadial()
      .angle(d => angleScale(d.attribute))
      .radius(d => radiusScale(+d.value));

    categories.forEach(category => {
      const categoryData = attributes.map(attribute => ({
        category,
        attribute,
        value: data.find(entry => entry.Category === category)[attribute]
      }));

      svg.append('path')
        .datum(categoryData)
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', color(category))
        .attr('stroke-width', 2)
        .attr('opacity', 0.7);

      svg.selectAll('.dot')
        .data(categoryData)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => radiusScale(+d.value) * Math.sin(angleScale(d.attribute)))
        .attr('cy', d => -radiusScale(+d.value) * Math.cos(angleScale(d.attribute)))
        .attr('r', 5)
        .attr('fill', color(category));
    });

    attributes.forEach(attribute => {
      const angle = angleScale(attribute);
      svg.append('line')
        .attr('class', 'axis')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.sin(angle))
        .attr('y2', -radius * Math.cos(angle))
        .attr('stroke', 'black');
    });
  };

  return <div ref={chartRef}></div>;
};

export default RadarChart;
