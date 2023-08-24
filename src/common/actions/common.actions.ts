import { createAction } from "@reduxjs/toolkit"
import { TasksStateType } from "features/TodolistsList/Todolist/Task/tasks_reducer"
import { TodolistDomainType } from "features/TodolistsList/Todolist/todolists_reducer"

export type ClearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolists: TodolistDomainType[]
}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>("common/clear-tasks-todolists")
