import React, { FC, useCallback } from "react"
import { EditableSpan } from "common/components"
import { IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { TodolistDomainType, todolistsThunks } from "features/todolists_list/todolist/todolists_slice"
import { useAppDispatch } from "common/hooks/use_app_dispatch"

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle: FC<Props> = ({ todolist }) => {
  const dispatch = useAppDispatch()

  const removeTodolistHandler = useCallback(() => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }, [todolist.id])

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.changeTodolistTitle({ id: todolist.id, title }))
    },
    [todolist.id]
  )

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}
