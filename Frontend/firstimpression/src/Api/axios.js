import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env?.VITE_BACKEND_BASE_URL ||
    process.env?.REACT_APP_BACKEND_BASE_URL ||
    "http://localhost:8080",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("jwtToken");
        
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error)=>{
           return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response)=>{
        return response;
    },

    (error)=>{
        return Promise.reject(error);
    }
)

export default api; 