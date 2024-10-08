import axios from 'axios';

// Create an Axios instance with the base URL of your Django API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // Replace with your Django API URL
});

export const getBrands = () => api.get('/brands/');  // Function to fetch brands
