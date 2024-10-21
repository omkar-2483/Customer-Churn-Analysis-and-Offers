import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8800', // Change this to your backend server URL
});

export default instance;
