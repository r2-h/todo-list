import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app_slice"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils"
import { authAPI, LoginParamsType } from "features/auth/auth_api"
import { ResultCode } from "features/todolists_list/todolist/todolists_api"
import { RejectValueType } from "common/utils/createAppAsyncThunk"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  } as AuthReducerType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: null | RejectValueType }>(
  "auth/login",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await authAPI.login(arg)
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true }
    } else {
      const isShowAppError = !res.data.fieldsErrors.length
      return rejectWithValue({ data: res.data, showGlobalError: isShowAppError })
    }
  }
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const res = await authAPI.logout()
  if (res.data.resultCode === 0) {
    dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }))
    return { isLoggedIn: false }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
      return { isLoggedIn: true }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false })
    }
  }
)

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { logout, login, initializeApp }

export type AuthReducerType = {
  isLoggedIn: boolean
}
