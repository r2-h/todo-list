import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { authAPI, LoginParamsType } from "features/auth/auth_api"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

export const auth_reducer = slice.reducer
export const authActions = slice.actions

export const loginTC = (data: LoginParamsType) => {
  return async (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await authAPI.login(data)
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
      dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    const error = e as { message: string }
    handleServerNetworkError(error, dispatch)
  }
}
