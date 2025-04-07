"use client"

import { useEffect, useRef } from "react"
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js"
import "../styles/GraficoCircular.css"

Chart.register(PieController, ArcElement, Tooltip, Legend)

interface ZonaRiego {
  estado: "encendido" | "apagado" | "descompuesto" | "mantenimiento" | "fuera_de_servicio"
}

interface GraficoCircularProps {
  zonas: ZonaRiego[]
}

const GraficoCircular = ({ zonas = [] }: GraficoCircularProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart<"pie"> | null>(null)

  useEffect(() => {
    if (!chartRef.current || zonas.length === 0) return

    const conteoEstados = zonas.reduce((acc, zona) => {
      acc[zona.estado] = (acc[zona.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const estados = Object.keys(conteoEstados)
    const counts = Object.values(conteoEstados)

    const backgroundColors = estados.map(estado => {
      switch(estado) {
        case "encendido": return "#4CAF50"
        case "apagado": return "#9E9E9E"
        case "descompuesto": return "#F44336"
        case "mantenimiento": return "#FFC107"
        case "fuera_de_servicio": return "#607D8B"
        default: return "#000000"
      }
    })

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: estados.map(e => e.charAt(0).toUpperCase() + e.slice(1).replace('_', ' ')),
          datasets: [{
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => `${color}CC`),
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const value = context.raw as number
                  const percentage = Math.round((value / total) * 100)
                  return `${context.label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    }

    return () => {
      chartInstance.current?.destroy()
    }
  }, [zonas])

  return (
    <div className="grafico-circular-container">
      <h3>Distribución de Zonas por Estado</h3>
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

export default GraficoCircular