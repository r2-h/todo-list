import {
  TodolistDomainType,
  todolistsReducer,
  todolistsThunks,
} from "features/todolists_list/todolist/model/todolists_reducer"
import { tasksReducer, TasksStateType } from "features/todolists_list/todolist/task/model/tasks_reducer"
import { TodolistType } from "features/todolists_list/todolist/api/todolists_api"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  }

  const action = todolistsThunks.addTodolist.fulfilled({ todolist }, "requestId", "")

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
