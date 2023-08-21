import logo from './logo.svg';
import './App.css';
import BarChart from './BarChart'; // Import the BarChart component
import React, { useState } from 'react';
import PieChart from './PieChart';
import RadarChart from './RadarChart';
import axios from 'axios'; // Import Axios


function App() {

  const sampleRadarData = [
    { Total: 2049, Quantity: 2, Status: 'Delivered' },
    { Total: 3596, Quantity: 2, Status: 'Delivered' },
    { Total: 3596, Quantity: 2, Status: 'Returned' },
    { Total: 999, Quantity: 2, Status: 'Delivered' },
    { Total: 999, Quantity: 2, Status: 'Delivered' },
    { Total: 3417, Quantity: 2, Status: 'Delivered' },
    { Total: 950, Quantity: 2, Status: 'Delivered' },
    { Total: 2156, Quantity: 2, Status: 'Delivered' },
    { Total: 3417, Quantity: 2, Status: 'Delivered' },
    { Total: 999, Quantity: 2, Status: 'Returned' },
    { Total: 2156, Quantity: 2, Status: 'Returned' },
    { Total: 599, Quantity: 2, Status: 'Delivered' },
    { Total: 3596, Quantity: 2, Status: 'Delivered' },
    { Total: 3417, Quantity: 2, Status: 'Delivered' },
    { Total: 3719, Quantity: 2, Status: 'Delivered' },
    { Total: 999, Quantity: 2, Status: 'Delivered' },
    { Total: 3596, Quantity: 2, Status: 'Delivered' },
    { Total: 599, Quantity: 2, Status: 'Delivered' },
    { Total: 599, Quantity: 2, Status: 'Delivered' },
    { Total: 999, Quantity: 2, Status: 'Delivered' },
  ];
  

  

  const [showBarChart, setBarChart] = useState(false);
  const [showPieChart, setPieChart] = useState(false);
  const [showRadarChart, setRadarChart] = useState(false);

  const handleBarChartClick = () => {
    setBarChart(true);
    makeCountRequest();
  };

  const handlePieChartClick = () => {
    setPieChart(true);
    makePieRequest();
  };

  const handleRadarChartClick = () => {
    setRadarChart(true);
    makeRadarRequest();
  };

  const makeCountRequest = () => {
    axios.get('http://localhost:8000/count')
      .then(response => {
        // Handle the response here if needed
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const makeRadarRequest = () => {
    axios.get('http://localhost:8000/radar')
      .then(response => {
        // Handle the response here if needed
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const makePieRequest = () => {
    axios.get('http://localhost:8000/pie')
      .then(response => {
        // Handle the response here if needed
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="App">

      <div>
        <button onClick={handleBarChartClick}>Bar Chart for Order Status Distribution</button>
      </div>
      {showBarChart && <BarChart />}
      
      <div>
        <button onClick={handlePieChartClick}>Pie Chart for COD vs. Non-COD Orders</button>
      </div>
      {showPieChart && <PieChart />}

      <div>
        <button onClick={handleRadarChartClick}>Radar Chart for Product Attributes</button>
      </div>
      {showRadarChart && <RadarChart data={sampleRadarData}/>}
    </div>
  );
}

export default App;
