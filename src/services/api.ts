import axios from 'axios';

const api = axios.create({
  baseURL: 'https://serverplantmanager.herokuapp.com/'
});

export default api;