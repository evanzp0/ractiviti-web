import axios from "axios";
import axiosInherit from 'axios-inherit'

axiosInherit(axios);

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
}, function (e) {
    if (e.response.data && e.response.data.error) {
        alert(e.response.data.error);
    } else if (e.response.data) {
        alert(e.response.data);
    } else {
        alert(e);
    }

    // console.log(e);

    return Promise.reject(e);
});

export default axios.create({
    baseURL: "http://localhost:3000/service_api",
    headers: {
        "Content-type": "application/json"
    }
});