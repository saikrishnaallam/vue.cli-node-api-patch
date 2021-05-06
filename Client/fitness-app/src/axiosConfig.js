import axios from 'axios'

const HTTP = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        'authorization': ''
    }
})

export default HTTP