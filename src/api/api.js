import axios from "axios";

const API_BASE_URL = 'https://vital.zirapcha.uz';
const token = localStorage.getItem('token')

export const api = axios.create({
  baseURL: `${API_BASE_URL}/`, // Replace with your authentication API endpoint
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${token}`,
  },
});