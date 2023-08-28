import React, { memo, useCallback, useEffect } from "react"
import "./App.css"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import { useSelector } from "react-redux"

import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import { Login } from "features/auth/Login"
import { authThunks } from "features/auth/auth_reducer"
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { isInitializedSelector, statusSelector } from "app/app-selectors"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { isLoggedInSelector } from "features/auth/auth-selectors"
import { ErrorSnackbar } from "common/components"
import { appThunks } from "app/app-reducer"

type PropsType = {
  demo?: boolean
}

export const App = memo(({ demo = false }: PropsType) => {
  const status = useSelector(statusSelector)
  const isInitialized = useSelector(isInitializedSelector)
  const isLoggedIn = useSelector(isLoggedInSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(appThunks.initializeApp())
  }, [])

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout())
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <HashRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/toDoList"} element={<Navigate to={"/"} />} />
            <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
            <Route path={"*"} element={<Navigate to={"/404"} />} />
          </Routes>
        </Container>
      </div>
    </HashRouter>
  )
})
