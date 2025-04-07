import axios from 'axios';

const API_URL = 'http://localhost:3003';

interface LoginData {
  email: string;
  password: string;
  date_birthday: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  date_birthday: string;
}

export const AuthService = {
  async login(data: LoginData) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        transformRequest: [(data) => JSON.stringify(data)],
        timeout: 10000
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.statusText || 
                           'Error durante el login';
        console.error('Error en login:', {
          status: error.response?.status,
          message: errorMessage,
          data: error.response?.data
        });
        throw new Error(errorMessage);
      }
      throw new Error('Error de conexión');
    }
  },

  async register(data: RegisterData) {
    try {
      const formatDate = (dateStr: string) => {
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      const response = await axios.post(`${API_URL}/auth/register`, {
        ...data,
        date_birthday: formatDate(data.date_birthday)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        transformRequest: [(data) => JSON.stringify(data)],
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          data: error.response?.data,
          message: error.response?.data?.message || 
                 error.response?.statusText || 
                 'Error durante el registro'
        };
        console.error('Error en registro:', errorDetails);
        
        if (error.response?.status === 409) {
          throw new Error('El email ya está registrado');
        }
        if (error.response?.status === 400) {
          throw new Error('Datos inválidos: ' + (error.response.data.message || ''));
        }
        
        throw new Error(errorDetails.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  getCurrentUser() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decodificando token:', e);
      localStorage.removeItem('access_token');
      return null;
    }
  }
};