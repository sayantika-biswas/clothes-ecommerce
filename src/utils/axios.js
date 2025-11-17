import axios from 'axios';

const instance = axios.create({
  baseURL:'https://clothes-backend-1.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     // Any status code that lies within the range of 2xx causes this function to trigger
//     return response;
//   },
//   (error) => {
//     // Any status codes that falls outside the range of 2xx causes this function to trigger
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors
//       localStorage.removeItem('token');
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

 export default instance;
