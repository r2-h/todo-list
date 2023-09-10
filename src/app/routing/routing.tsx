import { Container } from "@mui/material"
import { Navigate, Route, Routes } from "react-router-dom"
import { TodolistsList } from "features/todolists_list/todolists_list"
import { Login } from "features/auth/login"
import React, { FC, memo } from "react"

type Props = {
  demo?: boolean
}
export const Routing: FC<Props> = memo(({ demo }) => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList demo={demo} />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/toDoList"} element={<Navigate to={"/"} />} />
        <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
        <Route path={"*"} element={<Navigate to={"/404"} />} />
      </Routes>
    </Container>
  )
})
