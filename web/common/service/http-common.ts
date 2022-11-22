import axios from "axios";
import axiosInherit from 'axios-inherit'

axiosInherit(axios);

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        return response.data;
    }, 
    function (e) {
        console.log(e.response.data);
        
        alert(e.response.data.error);

        return Promise.reject(e.response.data);
    }
);

export default axios.create({
    baseURL: "http://localhost:3000/service_api",
    headers: {
        "Content-type": "application/json"
    }
});