import { RequestStatusType } from "app/app_slice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils"
import { ResultCode, todolistsAPI, TodolistType } from "features/todolists_list/todolist/todolists_api"

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
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>("todolists/fetchTodolists", async () => {
  const res = await todolistsAPI.getTodolists()
  return { todolists: res.data }
})

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todo/removeTodolist",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
    const res = await todolistsAPI.deleteTodolist(id)
    if (res.data.resultCode === ResultCode.success) {
      return { id }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  }
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todo/addTodolist",
  async (title, { rejectWithValue }) => {
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.success) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false })
    }
  }
)

const changeTodolistTitle = createAppAsyncThunk<changeTodolistTitleArgType, changeTodolistTitleArgType>(
  "todolists/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsAPI.updateTodolist(arg)
    if (res.data.resultCode === ResultCode.success) {
      return arg
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
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
