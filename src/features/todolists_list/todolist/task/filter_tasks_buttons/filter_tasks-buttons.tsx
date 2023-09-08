import { Button } from "@mui/material"
import React, { FC, useCallback } from "react"
import { TodolistDomainType, todolistsActions } from "features/todolists_list/todolist/model/todolists_reducer"
import { useAppDispatch } from "common/hooks/use_app_dispatch"

type Props = { todolist: TodolistDomainType }

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
  const dispatch = useAppDispatch()

  const onAllClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "all" })),
    [todolist.id]
  )
  const onActiveClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "active" })),
    [todolist.id]
  )
  const onCompletedClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "completed" })),
    [todolist.id]
  )

  return (
    <div style={{ paddingTop: "10px" }}>
      <Button variant={todolist.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={onActiveClickHandler}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={onCompletedClickHandler}
        color={"secondary"}
      >
        Completed
      </Button>
    </div>
  )
}
