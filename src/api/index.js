const axios = require('axios');
const port = 8000
const apiVersion = 'api/v1'; // Thay đổi phiên bản API nếu cần
const axiosInstance = axios.create({
  baseURL: `http://127.0.0.1:${port}/${apiVersion}`, // Thay đổi baseURL
 headers: {'Content-Type': 'application/json'}
}); 
module.exports = axiosInstance;