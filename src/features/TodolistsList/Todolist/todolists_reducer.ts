import { appActions, RequestStatusType } from "app/app-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils"
import { ResultCode, todolistsAPI, TodolistType } from "features/TodolistsList/todolists_api"

const slice = createSlice({
  name: "todolists",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, (state, action) => {
        return action.payload.todolists
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index > -1) {
          state[index].title = action.payload.title
        }
      })
  },
})

// thunks
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.getTodolists()
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
      await todolistsAPI.deleteTodolist(todolistId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { id: todolistId }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "idle" }))
      return rejectWithValue(null)
    }
  }
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistsAPI.createTodolist(title)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

const changeTodolistTitle = createAppAsyncThunk<changeTodolistTitleArgType, changeTodolistTitleArgType>(
  "todolists/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await todolistsAPI.updateTodolist(arg)
      if (res.data.resultCode === ResultCode.success) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }

// types
export type changeTodolistTitleArgType = {
  id: string
  title: string
}
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
