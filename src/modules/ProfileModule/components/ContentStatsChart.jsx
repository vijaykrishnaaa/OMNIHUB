import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const ContentStatsChart = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) {
    return <p className="text-gray-500 text-center py-8">No content has been uploaded yet.</p>;
  }

  const data = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Uploaded Content',
        data: Object.values(stats),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)', // Reddish Pink
          'rgba(54, 162, 235, 0.8)', // Blue
          'rgba(255, 206, 86, 0.8)', // Yellow
          'rgba(75, 192, 192, 0.8)',  // Teal
          'rgba(153, 102, 255, 0.8)', // Purple
        ],
        borderColor: [
          '#1f2937'
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#d1d5db' 
        }
      },
      title: {
        display: false,
      },
    },
  };

  return <div className="max-w-xs mx-auto"><Pie data={data} options={options} /></div>;
};

export default ContentStatsChart;