import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authActions } from "features/auth/auth_reducer"
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils"
import { authAPI } from "features/auth/auth_api"
import { ResultCode } from "features/TodolistsList/todolists_api"

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
  },
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isInitialized = action.payload.isInitialized
    })
  },
})

const initializeApp = createAppAsyncThunk<{ isInitialized: boolean }>("app/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.success) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
  return { isInitialized: true }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = { initializeApp }

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
  status: RequestStatusType
  error: string | null
  isInitialized: boolean
}
