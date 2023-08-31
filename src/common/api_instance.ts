import axios from "axios"

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "28672",
  },
}
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
})

export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
  fieldsErrors: []
}
