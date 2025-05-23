import axios, { AxiosError, type AxiosInstance } from 'axios'

export default class BaseService {
  instance: AxiosInstance
  token: string = ''
  constructor(token: string) {
    this.token = token
    this.instance = axios.create({
      // baseURL: Config.SERVER,
      baseURL: 'http://110.42.253.75:7573',
      timeout: 10000,
      headers: {
        token: this.token,
      },
    })
    this.instance.interceptors.request.use((x) => {
      x.headers.token = this.token
      return x
    })
    this.instance.interceptors.response.use((x) => {
      return x
    })
  }
}
