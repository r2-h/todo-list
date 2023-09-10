import { Task } from "features/todolists_list/todolist/tasks/task/task"
import React, { FC } from "react"
import { TaskStatuses } from "common/enums"
import { TodolistDomainType } from "features/todolists_list/todolist/todolists_slice"
import { TaskDomainType } from "features/todolists_list/todolist/tasks/tasks_slice"

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
}

export const Tasks: FC<Props> = ({ todolist, tasks }) => {
  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </div>
  )
}
