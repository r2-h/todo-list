import { appActions, RequestStatusType } from "app/app_slice"
import { todolistsThunks } from "features/todolists_list/todolist/todolists_slice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { ResultCode } from "features/todolists_list/todolist/todolists_api"
import { TaskPriorities, TaskStatuses } from "common/enums"
import { tasksAPI, TaskType, UpdateTaskModelType } from "features/todolists_list/todolist/tasks/taks-api"

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
        state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" })
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
  "task/fetchTasks",
  async (todolistId) => {
    const res = await tasksAPI.getTasks(todolistId)
    return { tasks: res.data.items, todolistId }
  }
)

export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "task/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(
      tasksActions.changeTasksEntityStatus({
        taskId: arg.taskId,
        todolistId: arg.todolistId,
        entityStatus: "loading",
      })
    )
    await tasksAPI.deleteTask(arg)
    return { taskId: arg.taskId, todolistId: arg.todolistId }
  }
)

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "task/addTask",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await tasksAPI.createTask(arg)
    if (res.data.resultCode === ResultCode.success) {
      return { task: res.data.data.item }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false })
    }
  }
)

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "task/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI

    const task = getState().tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: "task not found" }))
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
    const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === ResultCode.success) {
      return arg
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
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

export type TasksStateType = Record<string, TaskDomainType[]>

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
