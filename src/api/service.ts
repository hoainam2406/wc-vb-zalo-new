
// service.ts
import axios from 'axios'

export const http = axios.create({
  timeout: 15000,
})

// / Chuẩn hoá baseURL: bỏ dấu / thừa ở đầu/cuối */
function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

// / Set baseURL theo URL host trả về (có thể là root hoặc đã kèm module) */
export function setApiBaseUrl(url: string) {
  if (url) {
    http.defaults.baseURL = normalizeBaseUrl(url)
    console.log(`[http] baseURL = ${http.defaults.baseURL}`)
  }
}

/** Set/Clear Authorization header */
export function setAuthToken(token?: string, tokenType: string = 'Bearer') {
  if (token) {
    http.defaults.headers.common['Authorization'] = `${tokenType} ${token}`
    console.log('[http] Authorization set')
  } else {
    delete http.defaults.headers.common['Authorization']
    console.log('[http] Authorization cleared')
  }
}

// Interceptors
http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('HTTP Error:', error?.response?.status, error?.message)
    return Promise.reject(error)
  },
)
