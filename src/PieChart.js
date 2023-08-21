import React, { Component } from 'react';
import * as d3 from 'd3';

class PieChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [
      { label: 'COD', value: 1012 },
      { label: 'Non-COD', value: 578 },
    ];

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal().domain(data.map(d => d.label)).range(d3.schemeCategory10);

    const svg = d3
      .select('#pieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value);

    const arc = d3.arc().outerRadius(radius).innerRadius(0);

    const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label));

    const legend = svg
      .selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(-30,${i * 25})`);

    legend
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', d => color(d.label));

    legend
      .append('text')
      .attr('x', 30)
      .attr('y', 15)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d.label);
  }

  render() {
    return <div id="pieChart"></div>;
  }
}

export default PieChart;
