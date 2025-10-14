import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReviewStatsChart = ({ stats }) => {
  if (!stats) {
    return <p className="text-gray-500 text-center py-4">Loading stats...</p>;
  }

  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const chartData = Array(10).fill(0);

  stats.forEach(stat => {
    const ratingIndex = stat._id - 1;
    if (ratingIndex >= 0 && ratingIndex < 10) {
      chartData[ratingIndex] = stat.count;
    }
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Reviews',
        data: chartData,
        backgroundColor: 'rgba(234, 88, 12, 0.6)',
        borderColor: 'rgba(234, 88, 12, 1)',
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
        text: 'Review Rating Distribution',
        color: '#d1d5db',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ReviewStatsChart;