import React from "react"
import { Provider } from "react-redux"
import { combineReducers } from "redux"
import { v1 } from "uuid"
import thunkMiddleware from "redux-thunk"
import { configureStore } from "@reduxjs/toolkit"
import { HashRouter } from "react-router-dom"
import { tasksReducer } from "features/todolists_list/todolist/tasks/tasks_slice"
import { todolistsReducer } from "features/todolists_list/todolist/todolists_slice"
import { appReducer } from "app/app_slice"
import { authReducer } from "features/auth/auth_slice"
import { AppRootStateType } from "app/store"

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

const rootReducer: any = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn What to learn What to learn What to learn",
      filter: "all",
      entityStatus: "idle",
      addedDate: "",
      order: 0,
    },
    { id: "todolistId2", title: "What to buy", filter: "all", entityStatus: "loading", addedDate: "", order: 0 },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML&CSS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: "idle",
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: "idle",
      },
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "Milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: "idle",
      },
      {
        id: v1(),
        title: "React Book",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: "idle",
      },
    ],
  },
  app: {
    error: null,
    status: "succeeded",
    isInitialized: true,
  },
  auth: {
    isLoggedIn: true,
  },
}

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

export const ReduxStoreProviderDecorator = (storyFn: any) => <Provider store={storyBookStore}>{storyFn()}</Provider>

export const BrowserRouterDecorator = (storyFn: any) => <HashRouter>{storyFn()}</HashRouter>
