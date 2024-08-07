import axios from 'axios'
import { BASE_URL } from './config'

const instance = axios.create({
    baseURL : BASE_URL,
    headers: {
        "Content-type": "application/json",
    },
    withCredentials :true
})

// instance.interceptors.request.use(
//     (config)=>{
//     const token = localStorage.getItem('token')
//     if(token){
//         config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//     },
//     (error)=>{
//         Promise.reject(error)
//     }
// )


 
export default instance