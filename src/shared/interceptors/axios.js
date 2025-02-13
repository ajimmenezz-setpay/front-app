import axios from 'axios'

import { HOST_API, HOST_API_V2 } from '@/config'
import { isHTML } from '@/shared/utils'

const axiosInstance = axios.create({
  baseURL: HOST_API
})

export const API_SET_V2 = axios.create({
  baseURL: HOST_API_V2
})

API_SET_V2.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export const getErrorAPI = (error, errorMessage = '') =>
  error?.response?.data && !isHTML(error?.response?.data) && error?.response?.status !== 406
    ? error?.response?.data?.message || error?.response?.data
    : errorMessage

export default axiosInstance
