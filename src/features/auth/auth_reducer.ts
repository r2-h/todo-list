import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils"
import { authAPI, LoginParamsType } from "features/auth/auth_api"
import { ResultCode } from "features/TodolistsList/todolists_api"

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
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const res = await authAPI.login(arg)
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

export const auth_reducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { logout, login }
