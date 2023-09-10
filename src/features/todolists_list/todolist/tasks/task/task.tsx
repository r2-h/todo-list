import React, { ChangeEvent, FC, memo, useCallback } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { EditableSpan } from "common/components/editable_span/editable_span"
import { Delete } from "@mui/icons-material"
import { TaskStatuses } from "common/enums"
import { TaskDomainType, tasksThunks } from "features/todolists_list/todolist/tasks/tasks_slice"
import { useAppDispatch } from "common/hooks/use_app_dispatch"
import s from "features/todolists_list/todolist/tasks/task/task.module.css"

type Props = {
  task: TaskDomainType
  todolistId: string
}

export const Task: FC<Props> = memo(({ task, todolistId }) => {
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => dispatch(tasksThunks.removeTask({ taskId: task.id, todolistId: todolistId }))

  const changeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked
      dispatch(
        tasksThunks.updateTask({
          taskId: task.id,
          domainModel: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
          todolistId: todolistId,
        })
      )
    },
    [task.id, todolistId]
  )

  const changeTitleHandler = useCallback(
    (newValue: string) => {
      dispatch(
        tasksThunks.updateTask({
          taskId: task.id,
          domainModel: { title: newValue },
          todolistId: todolistId,
        })
      )
    },
    [task.id, todolistId]
  )

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeStatusHandler} />
      <EditableSpan value={task.title} onChange={changeTitleHandler} />
      <IconButton onClick={removeTaskHandler} disabled={task.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  )
})
