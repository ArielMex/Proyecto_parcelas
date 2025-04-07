import { FC, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../styles/Graficos.css";

// Registrar componentes de Chart.js (incluyendo Filler para áreas)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GraficosProps {
  sensoresGenerales: {
    temperatura: number;
    humedad: number;
    lluvia: number;
    sol: number;
  };
}

interface HistoricalData {
  id: number;
  temperatura: number;
  humedad: number;
  lluvia: number;
  sol: number;
  recordedAt: string;
}

const Graficos: FC<GraficosProps> = ({ sensoresGenerales }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  // Simular datos históricos (como en tus componentes originales)
  useEffect(() => {
    const now = new Date();
    const mockData: HistoricalData[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now);
      hour.setHours(now.getHours() - i);
      
      mockData.push({
        id: i,
        temperatura: sensoresGenerales.temperatura * (1 + (Math.random() - 0.5) * 0.2),
        humedad: sensoresGenerales.humedad * (1 + (Math.random() - 0.5) * 0.2),
        lluvia: sensoresGenerales.lluvia * (1 + (Math.random() - 0.5) * 0.2),
        sol: sensoresGenerales.sol * (1 + (Math.random() - 0.5) * 0.2),
        recordedAt: hour.toISOString(),
      });
    }
    
    setHistoricalData(mockData);
  }, [sensoresGenerales]);

  if (historicalData.length === 0) {
    return <div className="no-data">No hay datos para mostrar</div>;
  }

  // Opciones comunes (responsive, leyendas, ejes)
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            const unit = context.dataset.label.includes("Temperatura") ? "°C" : 
                        context.dataset.label.includes("Humedad") ? "%" : 
                        context.dataset.label.includes("Lluvia") ? "mm" : "%";
            return `${label}: ${value}${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Tiempo", font: { size: 12 } },
        ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } },
      },
      y: {
        title: { 
          display: true, 
          text: "Valor", 
          font: { size: 12 } 
        },
        ticks: { font: { size: 10 } },
      },
    },
  };

  // --- Gráfico 1: Histograma de Promedios (adaptado de BarChartSensores) ---
  const dataHistograma = {
    labels: ["Temperatura", "Humedad", "Lluvia", "Sol"],
    datasets: [{
      label: "Promedio",
      data: [
        historicalData.reduce((sum, data) => sum + data.temperatura, 0) / historicalData.length,
        historicalData.reduce((sum, data) => sum + data.humedad, 0) / historicalData.length,
        historicalData.reduce((sum, data) => sum + data.lluvia, 0) / historicalData.length,
        historicalData.reduce((sum, data) => sum + data.sol, 0) / historicalData.length,
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(255, 206, 86, 0.7)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    }],
  };

  // --- Gráfico 2: Líneas de Temperatura/Humedad (adaptado de LineChartSensores) ---
  const dataLineas = {
    labels: historicalData.map(data => 
      new Date(data.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: historicalData.map(data => data.temperatura),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        fill: true, // Área rellena (como en AreaChartSensores)
      },
      {
        label: "Humedad (%)",
        data: historicalData.map(data => data.humedad),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // --- Gráfico 3: Barras de Sol/Lluvia (adaptado de BarChartSensores) ---
  const dataBarras = {
    labels: historicalData.map(data => 
      new Date(data.recordedAt).toLocaleTimeString([], { hour: '2-digit' }) + "h"
    ),
    datasets: [
      {
        label: "Intensidad Solar (%)",
        data: historicalData.map(data => data.sol),
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Precipitación (mm)",
        data: historicalData.map(data => data.lluvia),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="graficos-container">
      <h2 className="graficos-titulo">Análisis de Sensores (Últimas 24h)</h2>
      
      <div className="grafico-group">
        {/* Histograma de Promedios */}
        <div className="grafico-card histogram-card">
          <h3>Promedios Generales</h3>
          <div className="chart-container histogram-container">
            <Bar 
              data={dataHistograma} 
              options={{ 
                ...commonOptions, 
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }} 
            />
          </div>
        </div>

        {/* Gráfico de Líneas (Temperatura/Humedad) */}
        <div className="grafico-card">
          <h3>Tendencias de Temperatura y Humedad</h3>
          <div className="chart-container">
            <Line 
              data={dataLineas} 
              options={{ 
                ...commonOptions,
                scales: {
                  ...commonOptions.scales,
                  y: { 
                    ...commonOptions.scales.y,
                    title: { ...commonOptions.scales.y.title, text: "Valor (°C o %)" },
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Barras (Sol/Lluvia) */}
      <div className="grafico-card">
        <h3>Intensidad Solar vs Precipitación</h3>
        <div className="chart-container">
          <Bar 
            data={dataBarras} 
            options={{ 
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                y: { 
                  ...commonOptions.scales.y,
                  title: { ...commonOptions.scales.y.title, text: "Valor (% o mm)" },
                  beginAtZero: true,
                },
              },
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Graficos;