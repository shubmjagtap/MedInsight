import React, { Component } from 'react';
import * as d3 from 'd3';

class StackChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [
      // Replace this sample data with your actual data
      { state: 'Tamil Nadu', quantity1: 20, quantity2: 30, quantity3: 10, quantity4: 100 },
      { state: 'Punjab', quantity1: 10, quantity2: 25, quantity3: 15 },
      { state: 'Telangana', quantity1: 15, quantity2: 35, quantity3: 5 },
      // Add more data points here...
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(this.refs.chart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(data.map(d => d.state));
    y.domain([0, d3.max(data, d => d3.sum(Object.values(d).slice(1))) * 1.2]);

    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const stack = d3.stack()
      .keys(Object.keys(data[0]).slice(1))
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(data);

    svg
      .selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('fill', d => z(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => x(d.data.state))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));
  }

  render() {
    return <div ref="chart"></div>;
  }
}

export default StackChart;
