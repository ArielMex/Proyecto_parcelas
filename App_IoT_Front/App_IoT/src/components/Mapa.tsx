"use client"

import mapboxgl, { type Map } from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import "../styles/Mapa.css"

interface SensorData {
  temperatura: number
  humedad: number
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
}

interface MapaProps {
  parcelas: Parcela[]
  loading: boolean
}

function Mapa({ parcelas, loading }: MapaProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<Map | null>(null)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = "pk.eyJ1IjoibmFodWkiLCJhIjoiY20yOTBiNjltMDBhYjJzcHk5MDdmc2xxNCJ9.mV_b0a8Xd74QivUBZqmADg"

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.81622976235745, 21.091662297320077],
        zoom: 10,
      })

      // Añadir controles de navegación
      map.current.addControl(new mapboxgl.NavigationControl())
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || loading) return

    // Eliminar marcadores existentes
    markers.forEach((marker) => marker.remove())

    // Crear nuevos marcadores con iconos de ubicación
    const newMarkers = parcelas.map((parcela) => {
      const popupContent = `
  <div class="parcela-popup">
    <h3>${parcela.nombre}</h3>
    <div class="popup-details">
      <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
      <p><strong>Responsable:</strong> ${parcela.responsable}</p>
      <p><strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}</p>
      <p><strong>Último riego:</strong> ${new Date(parcela.ultimo_riego).toLocaleString()}</p>
      <div class="sensor-data">
        <h4>Datos del sensor:</h4>
        <p><i class="temp-icon"></i> Temperatura: ${parcela.sensor.temperatura}°C</p>
        <p><i class="humidity-icon"></i> Humedad: ${parcela.sensor.humedad}%</p>
        <p><i class="rain-icon"></i> Lluvia: ${parcela.sensor.lluvia} mm</p>  <!-- Cambiado a mm -->
        <p><i class="sun-icon"></i> Intensidad del sol: ${parcela.sensor.sol}%</p>
      </div>
    </div>
  </div>
`

      // Crear elemento para el icono personalizado
      const el = document.createElement("div")
      el.className = "location-marker"
      el.style.backgroundImage = "url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)"
      el.style.width = "30px"
      el.style.height = "40px"
      el.style.backgroundSize = "cover"
      el.style.cursor = "pointer"

      const marker = new mapboxgl.Marker(el)
        .setLngLat([parcela.longitud, parcela.latitud])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current!)

      return marker
    })

    setMarkers(newMarkers)

    // Ajustar vista para mostrar todas las parcelas
    if (parcelas.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds()
      parcelas.forEach((parcela) => {
        bounds.extend([parcela.longitud, parcela.latitud])
      })
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12,
      })
    }
  }, [parcelas, loading])

  return (
    <div className="tittle-map">
    <div className="map-container-wrapper">
      <h1 className="map-title">Cultivos del Sur | Mapa de Ubicaciones</h1>
      <div className="map-container" ref={mapContainer}>
        {loading && (
          <div className="map-loading-overlay">
            <div className="loading-spinner"></div>
            <p>Actualizando datos de parcelas...</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default Mapa