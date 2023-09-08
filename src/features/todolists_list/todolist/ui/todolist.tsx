import React, { FC, memo, useCallback, useEffect } from "react"
import { Task } from "features/todolists_list/todolist/task/ui/task"
import { TodolistDomainType, todolistsThunks } from "features/todolists_list/todolist/model/todolists_reducer"
import { TaskDomainType, tasksThunks } from "features/todolists_list/todolist/task/model/tasks_reducer"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { AddItemForm, EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import { FilterTasksButtons } from "features/todolists_list/todolist/task/filter_tasks_buttons/filter_tasks-buttons"

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
  demo?: boolean
}

export const Todolist: FC<Props> = memo(({ demo = false, todolist, tasks }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo) {
      return
    }
    dispatch(tasksThunks.fetchTasks(todolist.id))
  }, [])

  const addTask = useCallback(
    (title: string) => {
      dispatch(tasksThunks.addTask({ title, todolistId: todolist.id }))
    },
    [todolist.id]
  )
  const removeTodolistHandler = useCallback(() => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }, [todolist.id])
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.changeTodolistTitle({ id: todolist.id, title }))
    },
    [todolist.id]
  )

  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
