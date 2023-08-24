import React, { memo, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { AppRootStateType } from "app/store"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/Todolist/todolists_reducer"
import { tasksThunks, TasksStateType } from "features/TodolistsList/Todolist/Task/tasks_reducer"
import { Grid, Paper } from "@mui/material"
import { Todolist } from "./Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { isLoggedInSelector } from "features/auth/auth-selectors"
import { AddItemForm } from "common/components"
import { TaskStatuses } from "common/enums"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = memo(({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks)
  const isLoggedIn = useSelector(isLoggedInSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  const removeTask = useCallback(function (id: string, todolistId: string) {
    dispatch(tasksThunks.removeTask({ taskId: id, todolistId }))
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ title, todolistId }))
  }, [])

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId: id, domainModel: { status }, todolistId }))
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId: id, domainModel: { title: newTitle }, todolistId }))
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolistId, filter: value }))
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    dispatch(todolistsThunks.removeTodolist(id))
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistsThunks.changeTodolistTitle({ id, title }))
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title))
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
})
