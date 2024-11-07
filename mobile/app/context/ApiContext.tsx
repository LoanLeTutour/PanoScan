// api.ts
import axios from 'axios';


import { backend_url } from '@/constants/backend_url';

// Axios instance
const api = axios.create({
  baseURL: backend_url(),
});


export default api;
