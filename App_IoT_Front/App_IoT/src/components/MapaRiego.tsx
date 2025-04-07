"use client"

import mapboxgl, { type Map } from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import "../styles/Mapa.css"

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

interface MapaRiegoProps {
  onRefresh?: () => void
  loading?: boolean
  key?: string
}

function MapaRiego({ onRefresh, loading: externalLoading }: MapaRiegoProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<Map | null>(null)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])
  const [internalLoading, setInternalLoading] = useState(true)
  const [zonas, setZonas] = useState<ZonaRiego[]>([])
  const [dataVersion, setDataVersion] = useState(0)

  // Estados para colores y símbolos
  const estadoColors = {
    encendido: "#4CAF50",
    apagado: "#9E9E9E",
    descompuesto: "#F44336",
    mantenimiento: "#FFC107",
    fuera_de_servicio: "#607D8B"
  }

  const estadoSymbols = {
    encendido: "💧",
    apagado: "⏸️",
    descompuesto: "⚠️",
    mantenimiento: "🛠️",
    fuera_de_servicio: "🚫"
  }

  const fetchZonasRiego = async () => {
    setInternalLoading(true)
    try {
      const timestamp = Date.now()
      const response = await fetch(`https://moriahmkt.com/iotapp/am/?t=${timestamp}`)
      const data = await response.json()
      
      setZonas(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(data.zonas)) {
          return data.zonas
        }
        return prev
      })
      
      setDataVersion(v => v + 1)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error fetching zones:", error)
    } finally {
      setInternalLoading(false)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('zonasRiegoCache')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    fetchZonasRiego()
    const interval = setInterval(fetchZonasRiego, 300000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = "pk.eyJ1IjoibmFodWkiLCJhIjoiY20yOTBiNjltMDBhYjJzcHk5MDdmc2xxNCJ9.mV_b0a8Xd74QivUBZqmADg"

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.8483, 21.0475],
        zoom: 15,
      })
      map.current.addControl(new mapboxgl.NavigationControl())
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current || internalLoading) return

    markers.forEach(marker => marker.remove())

    const zonasValidas = zonas.filter(z => z.latitud && z.longitud)
    const newMarkers = zonasValidas.map(zona => {
      const popupContent = `
        <div class="zona-popup">
          <h3>${zona.nombre} <span style="color: ${zona.color}">■</span></h3>
          <div class="popup-details">
            <p><strong>Sector:</strong> ${zona.sector}</p>
            <p><strong>Tipo:</strong> ${zona.tipo_riego}</p>
            <p><strong>Estado:</strong> <span class="estado-tag ${zona.estado}">${estadoSymbols[zona.estado]} ${zona.estado}</span></p>
            ${zona.motivo ? `<p><strong>Motivo:</strong> ${zona.motivo}</p>` : ''}
            <p><strong>Actualizado:</strong> ${new Date(zona.fecha).toLocaleString()}</p>
          </div>
        </div>
      `

      const el = document.createElement("div")
      el.className = "riego-marker"
      el.innerHTML = `
        <div class="marker-container" style="background:${zona.color}">
          <span class="marker-symbol">${estadoSymbols[zona.estado]}</span>
        </div>
      `
      el.style.cursor = "pointer"

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([zona.longitud!, zona.latitud!])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current!)

      return marker
    })

    setMarkers(newMarkers)

    if (zonasValidas.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds()
      zonasValidas.forEach(zona => bounds.extend([zona.longitud!, zona.latitud!]))
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 16
      })
    }
  }, [zonas, internalLoading, dataVersion])

  return (
    <div className="tittle-map">
      <div className="map-container-wrapper">
        <h1 className="map-title">Sistema de Riego | Mapa de Zonas</h1>
        <div className="map-container" ref={mapContainer}>
          {(externalLoading || internalLoading) && (
            <div className="map-loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando zonas...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapaRiego