import { Button } from "@mui/material"
import React, { FC, useCallback } from "react"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/todolists_list/todolist/todolists_slice"
import { useAppDispatch } from "common/hooks/use_app_dispatch"

type Props = { todolist: TodolistDomainType }

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
  const dispatch = useAppDispatch()

  const changeTasksFilterHandler = useCallback(
    (filter: FilterValuesType) => {
      dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter }))
    },
    [todolist.id]
  )

  return (
    <div style={{ paddingTop: "10px" }}>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={() => changeTasksFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={() => changeTasksFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeTasksFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </div>
  )
}
