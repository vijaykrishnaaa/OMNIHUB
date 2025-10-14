import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ArticleStatsChart = ({ stats }) => {
  if (!stats || (stats.Published === 0 && stats.Draft === 0)) {
    return <p className="text-gray-500 text-center py-4">No article data to display.</p>;
  }

  const data = {
    labels: ['Published', 'Draft'],
    datasets: [
      {
        label: 'Number of Articles',
        data: [stats.Published || 0, stats.Draft || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', 
          'rgba(255, 206, 86, 0.6)', 
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', 
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: 'Article Status Overview',
        color: '#d1d5db',
        font: {
            size: 16
        }
      },
    },
    scales: {
        x: {
            ticks: {
                color: '#9ca3af',
                stepSize: 1, 
            },
        },
        y: {
            ticks: {
                color: '#9ca3af',
            },
        }
    }
  };

  return <Bar data={data} options={options} />;
};

export default ArticleStatsChart;