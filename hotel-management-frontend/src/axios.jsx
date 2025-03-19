import Axios from "axios";

const axios =Axios.create({
    baseURL: "http://localhost:8085",
    
    headers: {
        "Content-Type": "application/json",
    },
});
export default axios;