// externalApi.service.ts
import axios from 'axios';

const API_URL = 'https://moriahmkt.com/iotapp/updated/';
const HISTORICAL_API_URL = 'http://localhost:3003/sensor-data/history'; // Ajusta esta URL

export const ExternalApiService = {
  async getPlotData() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plot data:', error);
      throw error;
    }
  },

  async getDeletedPlots() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted plots:', error);
      throw error;
    }
  },

  async getHistoricalData() {
    try {
      const response = await axios.get(`${HISTORICAL_API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
};