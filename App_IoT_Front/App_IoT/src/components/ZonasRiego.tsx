"use client"

import { useEffect, useState } from "react"
import { FiAlertTriangle, FiTool, FiPower, FiRefreshCw } from "react-icons/fi"
import "../styles/ZonasRiego.css"

interface ZonaRiego {
  id: number
  sector: string
  nombre: string
  tipo_riego: "aspersión" | "goteo"
  estado: "encendido" | "apagado" | "descompuesto" | "mantenimiento" | "fuera_de_servicio"
  motivo: string | null
  fecha: string
  color: string
}

const ZonasRiego = () => {
  const [zonas, setZonas] = useState<ZonaRiego[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState("")

  const fetchZonasRiego = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://moriahmkt.com/iotapp/am/?t=${Date.now()}`)
      const data = await response.json()
      setZonas(data.zonas)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Error fetching irrigation zones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchZonasRiego()
    const interval = setInterval(fetchZonasRiego, 300000) // 5 minutos
    return () => clearInterval(interval)
  }, [])

  const zonasInoperativas = zonas.filter(z => 
    ["descompuesto", "mantenimiento", "fuera_de_servicio"].includes(z.estado)
  )

  const getEstadoIcon = (estado: string) => {
    switch(estado) {
      case "descompuesto":
        return <FiAlertTriangle className="icon descompuesto" />
      case "mantenimiento":
        return <FiTool className="icon mantenimiento" />
      case "fuera_de_servicio":
        return <FiPower className="icon fuera-servicio" />
      default:
        return null
    }
  }

  return (
    <div className="zonas-riego-container">
      <div className="header-section">
        <h2>Zonas de Riego Inoperativas</h2>
        <div className="controls">
          <button 
            onClick={fetchZonasRiego} 
            disabled={loading}
            className={`refresh-btn ${loading ? "loading" : ""}`}
          >
            <FiRefreshCw className={`refresh-icon ${loading ? "spin" : ""}`} />
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <span className="update-time">Últ. actualización: {lastUpdated}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Cargando zonas...</p>
        </div>
      ) : zonasInoperativas.length === 0 ? (
        <div className="no-results">
          <p>Todas las zonas están operativas</p>
        </div>
      ) : (
        <div className="zonas-list">
          {zonasInoperativas.map(zona => (
            <div 
              key={zona.id} 
              className="zona-card"
              style={{ borderLeft: `5px solid ${zona.color}` }}
            >
              <div className="zona-header">
                <h3>
                  {zona.nombre} 
                  <span className="sector">{zona.sector}</span>
                </h3>
                <div className={`estado ${zona.estado}`}>
                  {getEstadoIcon(zona.estado)}
                  <span>{zona.estado.replace("_", " ")}</span>
                </div>
              </div>

              <div className="zona-details">
                <p><strong>Tipo de riego:</strong> {zona.tipo_riego}</p>
                <p><strong>Motivo:</strong> {zona.motivo || "No especificado"}</p>
                <p><strong>Última actualización:</strong> {new Date(zona.fecha).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ZonasRiego