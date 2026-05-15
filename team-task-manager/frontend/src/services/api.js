import axios from 'axios';

const API = axios.create({
  baseURL: 'https://team-taskmanage-production.up.railway.app/', // Try 127.0.0.1 instead of localhost
});

export default API;
