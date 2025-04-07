import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/';

// Interceptor para añadir el token JWT automáticamente
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globalmente
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado - Redirigiendo a login');
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso prohibido');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        default:
          console.error('Error en la petición:', error.response.status);
      }
    }
    return Promise.reject(error);
  }
);

export interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  ultimo_riego: string;
  sensor: {
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
  };
  latitud: number;
  longitud: number;
  estado?: string;
  deletedAt?: string;
}

export interface ApiResponse {
  sensores: {
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
  };
  parcelas: Parcela[];
}

export const fetchData = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Recuperar datos del localStorage si hay error
    const savedData = localStorage.getItem('apiData');
    if (savedData) {
      return JSON.parse(savedData) as ApiResponse;
    }
    throw error;
  }
};

export const deleteParcel = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}parcelas/${id}`);
  } catch (error) {
    console.error(`Error deleting parcel ${id}:`, error);
    throw error;
  }
};

// Métodos adicionales útiles para tu dashboard
export const updateParcel = async (id: number, data: Partial<Parcela>): Promise<Parcela> => {
  try {
    const response = await axios.patch<Parcela>(`${API_URL}parcelas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating parcel ${id}:`, error);
    throw error;
  }
};

export const createParcel = async (data: Omit<Parcela, 'id'>): Promise<Parcela> => {
  try {
    const response = await axios.post<Parcela>(`${API_URL}parcelas`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating parcel:', error);
    throw error;
  }
};