import { tasksReducer } from "features/todolists_list/todolist/task/model/tasks_reducer"
import { todolistsReducer } from "features/todolists_list/todolist/model/todolists_reducer"
import { appReducer } from "app/app_reducer"
import { auth_reducer } from "features/auth/auth_reducer"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: auth_reducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
