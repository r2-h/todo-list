import React, { FC, memo, useCallback, useEffect } from "react"
import { TodolistDomainType } from "features/todolists_list/todolist/todolists_slice"
import { TaskDomainType, tasksThunks } from "features/todolists_list/todolist/tasks/tasks_slice"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { AddItemForm } from "common/components"
import { FilterTasksButtons } from "features/todolists_list/todolist/filter_tasks_buttons/filter_tasks-buttons"
import { Tasks } from "features/todolists_list/todolist/tasks/tasks"
import { TodolistTitle } from "features/todolists_list/todolist/todolist_title/todolist_title"

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
      return dispatch(tasksThunks.addTask({ title, todolistId: todolist.id })).unwrap()
    },
    [todolist.id]
  )

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} tasks={tasks} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
