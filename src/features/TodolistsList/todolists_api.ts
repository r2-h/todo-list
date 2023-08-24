import { instance, ResponseType } from "common/api_instance"
import { TaskPriorities, TaskStatuses } from "common/enums"
import { AddTaskArgType, RemoveTaskArgType } from "features/TodolistsList/Todolist/Task/tasks_reducer"
import { changeTodolistTitleArgType } from "features/TodolistsList/Todolist/todolists_reducer"

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(arg: changeTodolistTitleArgType) {
    return instance.put<ResponseType>(`todo-lists/${arg.id}`, { title: arg.title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(arg: RemoveTaskArgType) {
    return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
  },
  updateTask(todolistId: string, taskId: string, apiModel: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, apiModel)
  },
}

// types
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export const ResultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
