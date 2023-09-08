import { createAction } from "@reduxjs/toolkit"
import { TasksStateType } from "features/todolists_list/todolist/task/model/tasks_reducer"
import { TodolistDomainType } from "features/todolists_list/todolist/model/todolists_reducer"

export type ClearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolists: TodolistDomainType[]
}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>("common/clear-tasks-todolists")
