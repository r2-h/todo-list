import React, { memo, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { todolistsThunks } from "features/todolists_list/todolist/todolists_slice"
import { Grid, Paper } from "@mui/material"
import { Todolist } from "features/todolists_list/todolist/todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import { isLoggedInSelector } from "features/auth/auth_selectors"
import { AddItemForm } from "common/components"
import { selectTodolists } from "features/todolists_list/todolist/todolists_selector"
import { selectTasks } from "features/todolists_list/todolist/tasks/tasks_selectors"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = memo(({ demo = false }) => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(isLoggedInSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      return dispatch(todolistsThunks.addTodolist(title)).unwrap()
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
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
})
