import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_ADMIN_API_URL
});

instance.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.request.use(req => {
    const token = localStorage.getItem("jwtToken");
    if (token) req.headers.common["x-auth-token"] = token;
    return req;
});

instance.interceptors.response.use(
    res => res,
    err => {
        if (err.response.status === 401) {
            // localStorage.removeItem('jwtToken');
            window.location.href = "/login";
        }
    }
)
export default instance;
