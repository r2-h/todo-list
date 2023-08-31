import { instance, ResponseType } from "common/api_instance"
import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<
      ResponseType<{ userId?: number }>,
      AxiosResponse<BaseResponseType<{ userId?: number }>>,
      LoginParamsType
    >("auth/login", data)
  },
  logout() {
    return instance.delete<BaseResponseType<{ userId?: number }>>("auth/login")
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me")
  },
}
