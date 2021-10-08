'use strict';

const axios = require('axios')

const BASE_URL = process.env.BOULDERAI_CLI_BASE_URL || 'http://book.youbaobao.xyz:7001'
console.log(process.env.BOULDERAI_CLI_BASE_URL)
console.log(BASE_URL)

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
})

request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

module.exports = request;
