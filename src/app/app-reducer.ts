import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authActions } from "features/auth/auth_reducer"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { authAPI } from "features/auth/auth_api"

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{ value: boolean }>) => {
      state.isInitialized = action.payload.value
    },
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions

export const initializeAppTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
    dispatch(appActions.setAppInitialized({ value: true }))
  } catch (e) {
    const error = e as { message: string }
    handleServerNetworkError(error, dispatch)
  }
}

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
  status: RequestStatusType
  error: string | null
  isInitialized: boolean
}
