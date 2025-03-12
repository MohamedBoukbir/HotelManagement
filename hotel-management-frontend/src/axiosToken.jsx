import Axios from "axios";

const axios =Axios.create({
    
    baseURL: "http://localhost:8085",
    
    headers: {
        "Content-Type": "application/json",

    },
});

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default axios;