import { tasksReducer } from "features/todolists_list/todolist/tasks/tasks_slice"
import { todolistsReducer } from "features/todolists_list/todolist/todolists_slice"
import { appReducer } from "app/app_slice"
import { authReducer } from "features/auth/auth_slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
