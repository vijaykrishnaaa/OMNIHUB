import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WriteUpStatsChart = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) {
    return <p className="text-gray-500 text-center py-4">No write-up data to display.</p>;
  }

  const data = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Write-Ups per Category',
        data: Object.values(stats),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Category Breakdown',
        color: '#d1d5db',
        font: {
            size: 18
        }
      },
    },
    scales: {
        y: {
            ticks: {
                color: '#9ca3af',
                stepSize: 1, 
            },
        },
        x: {
            ticks: {
                color: '#9ca3af',
            },
        }
    }
  };

  return <Bar data={data} options={options} />;
};

export default WriteUpStatsChart;