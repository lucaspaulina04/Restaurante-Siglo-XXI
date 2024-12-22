import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los módulos necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
      {
        label: 'Ingresos',
        data: [5000, 7000, 8000, 6000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Egresos',
        data: [2000, 3000, 4000, 2500],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir personalizar la altura
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reporte Financiero Mensual',
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}> {/* Altura ajustada aquí */}
      <h1>Reportes Financieros</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Reports;
