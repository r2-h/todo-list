import { todolistsAPI, TodolistType } from "api/todolists-api"
import { Dispatch } from "redux"
import { handleServerNetworkError } from "utils/error-utils"
import { AppThunk } from "app/store"
import { appActions, RequestStatusType } from "app/app-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

const slice = createSlice({
  name: "todolists",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].title = action.payload.title
      }
    },
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
    setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists, (state, action) => {
      return action.payload.todolists
    })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistsAPI.getTodolists()
      dispatch(todolistsActions.setTodolists({ todolists: res.data }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }
}

export const removeTodolistTC = (todolistId: string) => {
  return async (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({ status: "loading" }))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
    try {
      await todolistsAPI.deleteTodolist(todolistId)
      dispatch(todolistsActions.removeTodolist({ id: todolistId }))
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }
}

export const addTodolistTC = (title: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistsAPI.createTodolist(title)
      dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await todolistsAPI.updateTodolist(id, title)
      dispatch(todolistsActions.changeTodolistTitle({ id, title }))
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }
}

// types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
