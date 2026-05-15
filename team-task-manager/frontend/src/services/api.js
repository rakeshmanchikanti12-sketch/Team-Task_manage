import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Try 127.0.0.1 instead of localhost
});

export default API;