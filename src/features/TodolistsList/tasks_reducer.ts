import { appActions, RequestStatusType } from "app/app-reducer"
import { todolistsThunks } from "features/TodolistsList/todolists_reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { handleServerAppError, handleServerNetworkError } from "common/utils"
import { ResultCode, TaskType, todolistsAPI, UpdateTaskModelType } from "features/TodolistsList/todolists_api"
import { TaskPriorities, TaskStatuses } from "common/enums"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    changeTasksEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityStatus: RequestStatusType }>
    ) => {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId ? { ...t, entityStatus: action.payload.entityStatus } : t
        ),
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((task) => ({ ...task, entityStatus: "idle" }))
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return action.payload.tasks
      })
  },
})

// thunks
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.getTasks(todolistId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { tasks: res.data.items, todolistId }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      dispatch(
        tasksActions.changeTasksEntityStatus({
          taskId: arg.taskId,
          todolistId: arg.todolistId,
          entityStatus: "loading",
        })
      )
      await todolistsAPI.deleteTask(arg)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      debugger
      return { taskId: arg.taskId, todolistId: arg.todolistId }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)
// export const _removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
//   try {
//     await todolistsAPI.deleteTask(todolistId, taskId)
//     dispatch(tasksActions.removeTask({ taskId, todolistId }))
//   } catch (e) {
//     const error = e as { message: string }
//     handleServerNetworkError(error, dispatch)
//   }
// }

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.createTask(arg)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { task: res.data.data.item }
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

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const task = getState().tasks[arg.todolistId].find((t) => t.id === arg.taskId)
      if (!task) {
        dispatch(appActions.setAppError({ error: "Task not found" }))
        return rejectWithValue(null)
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      }
      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
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

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }

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
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}

export type UpdateTaskArgType = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}
export type RemoveTaskArgType = {
  taskId: string
  todolistId: string
}
export type AddTaskArgType = {
  title: string
  todolistId: string
}
