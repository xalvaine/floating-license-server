const axios = require('axios').default;

const server = axios.create({
    baseURL: `http://localhost:5000/`,
    timeout: 1000 * 5,
});

export default server;