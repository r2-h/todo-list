import { tasksReducer } from "features/TodolistsList/tasks_reducer"
import { todolistsReducer } from "features/TodolistsList/todolists_reducer"
import { AnyAction, combineReducers } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { appReducer } from "./app-reducer"
import { auth_reducer } from "features/auth/auth_reducer"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: auth_reducer,
})
export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
})

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
