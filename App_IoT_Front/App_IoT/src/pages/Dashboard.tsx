"use client"

import { FC, useState, useEffect } from "react"
import { Cloud, Sun, Thermometer } from "lucide-react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import Mapa from "../components/Mapa"
import WeatherCard from "../components/WeatherCard"
import Graficos from "../components/Graficos"
import ParcelasEliminadas from "../components/ParcelasEliminadas"
import MapaRiego from "../components/MapaRiego"
import ZonasRiego from "../components/ZonasRiego"
import GraficoCircular from "../components/GraficoCircular"
import { ExternalApiService } from "../services/externalApi.service"
import "../styles/Dashboard.css"

interface SensorData {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string
  sensor: SensorData
  latitud: number
  longitud: number
  deletedAt?: string
}

interface ZonaRiego {
  id: number
  sector: string
  nombre: string
  tipo_riego: "aspersión" | "goteo"
  estado: "encendido" | "apagado" | "descompuesto" | "mantenimiento" | "fuera_de_servicio"
  latitud: number | null
  longitud: number | null
  motivo: string | null
  fecha: string
  color: string
}

interface ApiResponse {
  sensores: SensorData
  parcelas: Parcela[]
}

const Dashboard: FC = () => {
  const [view, setView] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [deletedParcels, setDeletedParcels] = useState<Parcela[]>([])
  const [zonasRiego, setZonasRiego] = useState<ZonaRiego[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [forceUpdate, setForceUpdate] = useState(0)

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [data, deletedData, zonasData] = await Promise.all([
        ExternalApiService.getPlotData(),
        ExternalApiService.getDeletedPlots(),
        fetch("https://moriahmkt.com/iotapp/am/").then(res => res.json())
      ])
      
      setApiData(data)
      setDeletedParcels(deletedData)
      setZonasRiego(zonasData.zonas)
      setLastUpdated(new Date().toLocaleTimeString())
      setForceUpdate(prev => prev + 1)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
    const interval = setInterval(loadAllData, 300000)
    return () => clearInterval(interval)
  }, [])

  const handleSelect = (selectedView: string) => {
    setView(selectedView)
  }

  if (!apiData || zonasRiego.length === 0) {
    return <div className="loading">Cargando datos...</div>
  }

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={handleSelect} currentView={view} />
      <div className="main-content">
        <Header 
          onRefresh={loadAllData} 
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <div className="dashboard-content">
          {view === "dashboard" && (
            <>
              <div className="weather-dashboard">
                <div className="map-weather-container">
                  <div className="map-container">
                    <Mapa 
                      parcelas={apiData.parcelas} 
                      loading={loading}
                    />
                  </div>
                  <div className="weather-cards-container">
                    <WeatherCard 
                      title="Temperatura" 
                      value={`${apiData.sensores.temperatura} °C`} 
                      icon={<Thermometer className="text-gray-600" />}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Humedad" 
                      value={`${apiData.sensores.humedad}%`}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Lluvia" 
                      icon={<Cloud className="text-gray-600" />} 
                      value={`${apiData.sensores.lluvia} mm`}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Intensidad del sol" 
                      icon={<Sun className="text-gray-600" />} 
                      value={`${apiData.sensores.sol}%`}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="graficos-section">
                <Graficos 
                  sensoresGenerales={apiData.sensores}
                  loading={loading}
                />
              </div>
            </>
          )}
          {view === "parcelas-eliminadas" && (
            <ParcelasEliminadas 
              parcelas={deletedParcels}
              loading={loading}
            />
          )}
          {view === "zonas-riego" && (
            <div className="zonas-riego-view">
              <div className="mapa-riego-section">
                <MapaRiego 
                  key={`zonas-${forceUpdate}`}
                  onRefresh={() => setLastUpdated(new Date().toLocaleTimeString())}
                  loading={loading}
                />
              </div>
              <div className="grafico-section">
                <GraficoCircular zonas={zonasRiego} />
              </div>
              <div className="zonas-inoperativas-section">
                <ZonasRiego />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard