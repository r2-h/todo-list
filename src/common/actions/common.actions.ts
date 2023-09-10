import { createAction } from "@reduxjs/toolkit"
import { TasksStateType } from "features/todolists_list/todolist/tasks/tasks_slice"
import { TodolistDomainType } from "features/todolists_list/todolist/todolists_slice"

export type ClearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolists: TodolistDomainType[]
}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>("common/clear-task-todolists")
