import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api"
import { Dispatch } from "redux"
import { AppRootStateType } from "app/store"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistsList/todolists-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>
    ) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks.map((task) => ({ ...task, entityStatus: "idle" }))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return action.payload.tasks
      })
  },
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(tasksActions.setTasks({ tasks: res.data.items, todolistId }))
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
  } catch (e) {
    const error = e as { message: string }
    handleServerNetworkError(error, dispatch)
  }
}

export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  try {
    await todolistsAPI.deleteTask(todolistId, taskId)
    dispatch(tasksActions.removeTask({ taskId, todolistId }))
  } catch (e) {
    const error = e as { message: string }
    handleServerNetworkError(error, dispatch)
  }
}

export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const res = await todolistsAPI.createTask(todolistId, title)
    if (res.data.resultCode === 0) {
      const task = res.data.data.item
      const action = tasksActions.addTask({ task })
      dispatch(action)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    const error = e as { message: string }
    handleServerNetworkError(error, dispatch)
  }
}

export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state")
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    }
    try {
      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
      if (res.data.resultCode === 0) {
        const action = tasksActions.updateTask({ taskId, model: domainModel, todolistId })
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (e) {
      const error = e as { message: string }
      handleServerNetworkError(error, dispatch)
    }
  }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
