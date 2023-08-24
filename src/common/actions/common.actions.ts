import { createAction } from "@reduxjs/toolkit"
import { TasksStateType } from "features/TodolistsList/tasks_reducer"
import { TodolistDomainType } from "features/TodolistsList/todolists_reducer"

export type ClearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolists: TodolistDomainType[]
}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>("common/clear-tasks-todolists")
