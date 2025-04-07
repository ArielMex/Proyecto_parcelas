"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import "../styles/ParcelasEliminadas.css"
import axios from "axios"

interface Parcela {
  id: number
  externalId: number // Añadido para mapear al id
  name: string // Cambiado de 'nombre'
  location: string // Cambiado de 'ubicacion'
  owner: string // Cambiado de 'responsable'
  plotType: string // Cambiado de 'tipo_cultivo'
  lastWatered: string // Cambiado de 'ultimo_riego'
  isActive: boolean
  deletedAt?: string
  latitude?: number // Campos adicionales que podrías necesitar
  longitude?: number
}

const ParcelasEliminadas: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeletedParcels = async () => {
      try {
        const response = await axios.get("http://localhost:3003/plots")
        const deletedParcels = response.data
          .filter((parcela: Parcela) => !parcela.isActive)
          .map((parcela: Parcela) => ({
            id: parcela.externalId, // Mapeamos externalId a id
            nombre: parcela.name,
            ubicacion: parcela.location,
            responsable: parcela.owner,
            tipo_cultivo: parcela.plotType,
            ultimo_riego: parcela.lastWatered,
            deletedAt: parcela.deletedAt,
            estado: "eliminada",
          }))
        setParcelas(deletedParcels)
      } catch (error) {
        console.error("Error al obtener parcelas eliminadas", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeletedParcels()
  }, [])

  if (loading) {
    return <div className="loading">Cargando datos...</div>
  }

  if (parcelas.length === 0) {
    return (
      <div className="no-data">
        <AlertCircle size={48} className="alert-icon" />
        <p>Parece que aún no hay parcelas eliminadas</p>
        <p className="subtext">Inténtalo más tarde</p>
      </div>
    )
  }

  return (
    <div className="parcelas-eliminadas-container">
      <h2>Parcelas Eliminadas</h2>
      <div className="parcelas-grid">
        {parcelas.map((parcela) => (
          <div key={parcela.id} className="parcela-card">
            <div className="parcela-header">
              <h3>{parcela.nombre}</h3>
            </div>
            <div className="parcela-details">
              <p>
                <strong>Ubicación:</strong> {parcela.ubicacion}
              </p>
              <p>
                <strong>Responsable:</strong> {parcela.responsable}
              </p>
              <p>
                <strong>Tipo de cultivo:</strong> {parcela.tipo_cultivo}
              </p>
              <p>
                <strong>Último riego:</strong> {new Date(parcela.ultimo_riego).toLocaleString()}
              </p>
              {parcela.deletedAt && (
                <p>
                  <strong>Eliminada el:</strong> {new Date(parcela.deletedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParcelasEliminadas

