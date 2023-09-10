import { instance } from "common/api_instance"
import { changeTodolistTitleArgType } from "features/todolists_list/todolist/todolists_slice"
import { BaseResponseType } from "common/types"

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title: title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(arg: changeTodolistTitleArgType) {
    return instance.put<BaseResponseType>(`todo-lists/${arg.id}`, { title: arg.title })
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
